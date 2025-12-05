import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase = null
if (SUPABASE_URL && SUPABASE_ANON) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
}

export default function MixtapeStore({ mixtapes = [] }) {
  const [uploads, setUploads] = useState(mixtapes)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { setUploads(mixtapes) }, [mixtapes])

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!supabase) { alert('Supabase not configured. Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'); return }
    setUploading(true)
    try {
      const filename = `${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from('mixtapes').upload(filename, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const publicUrl = supabase.storage.from('mixtapes').getPublicUrl(data.path).publicUrl
      setUploads(u => [{ title: file.name, price: '$8', img: '/mixtapes/vol1.jpg', preview: publicUrl, checkoutUrl: '#' }, ...u])
    } catch (err) { console.error(err); alert('Upload failed: ' + err.message) } finally { setUploading(false) }
  }

  return (
    <section id="mixtapes" style={{padding:32, maxWidth:900, margin:'0 auto'}}>
      <h2>Mixtape Store</h2>
      <div style={{marginBottom:16}}>
        <input type="file" accept="audio/*" onChange={handleFile} />
        <button disabled={uploading} style={{marginLeft:8,padding:'8px 12px',background:'#a200ff',color:'#fff',borderRadius:6}}>{uploading ? 'Uploading…' : 'Upload (Supabase)'}</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
        {uploads.map((m,i)=>(
          <div key={i} style={{background:'#111',padding:12,borderRadius:8}}>
            <img src={m.img} alt={m.title} style={{width:'100%',height:140,objectFit:'cover'}} />
            <h3>{m.title}</h3>
            <p>{m.price}</p>
            {m.preview && (<audio controls src={m.preview} style={{width:'100%'}} />)}
            <a href={m.checkoutUrl || '#'} style={{display:'inline-block',marginTop:8,padding:'8px 12px',background:'#a200ff',color:'#fff',borderRadius:6}}>Buy / Download</a>
          </div>
        ))}
      </div>
    </section>
  )
}