import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE // set this in Netlify env (sensitive)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const adminPass = req.headers['x-admin-pass'] || ''
  if (!process.env.ADMIN_PASS) {
    return res.status(500).json({ error: 'Server misconfigured: ADMIN_PASS not set' })
  }
  if (adminPass !== process.env.ADMIN_PASS) return res.status(401).json({ error: 'Unauthorized' })
  if (!SUPABASE_SERVICE_ROLE) {
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE not configured' })
  }
  const { link, title } = req.body
  if (!link) return res.status(400).json({ error: 'Missing link' })

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
    const { data, error } = await supabase.from('payment_links').insert([{ title: title || null, url: link }])
    if (error) throw error
    return res.status(200).json({ ok: true, data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
