import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const adminPass = req.headers['x-admin-pass'] || ''
  if (!process.env.ADMIN_PASS) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_PASS not set' })
  }
  if (adminPass !== process.env.ADMIN_PASS) return res.status(401).json({ error: 'Unauthorized' })

  const { price, productName } = req.body
  if (!price || !productName) return res.status(400).json({ error: 'Missing price or productName' })

  try {
    const product = await stripe.products.create({ name: productName })
    const priceObj = await stripe.prices.create({ unit_amount: Math.round(price * 100), currency: 'usd', product: product.id })
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: priceObj.id, quantity: 1 }]
    })
    return res.status(200).json({ url: paymentLink.url })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Stripe error' })
  }
}
