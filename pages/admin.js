import { useState } from 'react'
export default function Admin() {
  const [pass, setPass] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [links, setLinks] = useState([])

  function login() {
    if (pass === process.env.NEXT_PUBLIC_ADMIN_PASS) setAuthorized(true)
    else alert('Wrong pass. Set NEXT_PUBLIC_ADMIN_PASS in .env.local (this is basic protection).')
  }

  async function addLinkViaStripe() {
    const productName = prompt('Product name:')
    const price = prompt('Price in USD (number):')
    if (!productName || !price) return
    try {
      const resp = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pass': pass
        },
        body: JSON.stringify({ productName, price: Number(price) })
      })
      const data = await resp.json()
      if (data.url) {
        const save = await fetch('/api/save-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-pass': pass
          },
          body: JSON.stringify({ link: data.url, title: productName })
        })
        const saved = await save.json()
        if (saved.ok) {
          alert('Payment link created and saved.')
          setLinks(l=>[data.url,...l])
        } else {
          alert('Saved failed: '+JSON.stringify(saved))
        }
      } else {
        alert('Stripe failed: '+JSON.stringify(data))
      }
    } catch (err) {
      alert('Error: '+err.message)
    }
  }

  async function addLinkManually() {
    const url = prompt('Enter Stripe Payment Link URL for a mixtape product:')
    if (url) {
      const resp = await fetch('/api/save-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pass': pass
        },
        body: JSON.stringify({ link: url })
      })
      const data = await resp.json()
      if (data.ok) {
        setLinks(l=>[url,...l])
      } else {
        alert('Save failed: '+JSON.stringify(data))
      }
    }
  }

  return (
    <div style={{padding:24}}>
      <h1>Admin / Upload</h1>
      {!authorized ? (
        <div>
          <p>Enter admin pass:</p>
          <input value={pass} onChange={e=>setPass(e.target.value)} style={{padding:8}} />
          <button onClick={login} style={{marginLeft:8,padding:8,background:'#a200ff',color:'#fff'}}>Login</button>
        </div>
      ) : (
        <div>
          <p>Authorized. Use this page to create or add Stripe Payment Links.</p>
          <button onClick={addLinkViaStripe} style={{padding:8,background:'#a200ff',color:'#fff'}}>Create Stripe Payment Link & Save</button>
          <button onClick={addLinkManually} style={{padding:8,marginLeft:8,background:'#444',color:'#fff'}}>Add Existing Link</button>
          <ul>
            {links.map((l,i)=>(<li key={i}><a href={l} target="_blank" rel="noreferrer">{l}</a></li>))}
          </ul>
          <p>Note: Links are saved via Supabase service role key configured in Netlify environment.</p>
        </div>
      )}
    </div>
  )
}
