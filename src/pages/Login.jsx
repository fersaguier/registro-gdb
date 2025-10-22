import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  async function signIn(e){
    e.preventDefault(); setErr('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) setErr(error.message); else setSent(true)
  }

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'100vh'}}>
      <form onSubmit={signIn} style={{padding:24, border:'1px solid #ddd', borderRadius:12, width:360}}>
        <h2>Ingresar</h2>
        <p style={{fontSize:13}}>Te enviamos un link mágico a tu email.</p>
        <input type="email" required placeholder="tu@email.com"
          value={email} onChange={e=>setEmail(e.target.value)}
          style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ccc'}} />
        <button type="submit" style={{marginTop:10, width:'100%', padding:10, borderRadius:8, background:'#0a7a4b', color:'#fff'}}>Enviar link</button>
        {sent && <div style={{marginTop:10, color:'#0a7a4b'}}>Revisá tu correo para continuar.</div>}
        {err && <div style={{marginTop:10, color:'#b00020'}}>{err}</div>}
      </form>
    </div>
  )
}
