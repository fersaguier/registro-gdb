import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Siembra from './pages/Siembra'
import Cosecha from './pages/Cosecha'
import Procesamiento from './pages/Procesamiento'
import Resumen from './pages/Resumen'
import Config from './pages/Config'

const verde = '#0a7a4b'

function Shell({ user, role, onSignOut }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh'}}>
      <aside style={{background:verde, color:'#fff', padding:'18px'}}>
        <div style={{fontWeight:700, marginBottom:12}}>Registro de siembras y cosechas — GDB</div>
        <nav style={{display:'grid', gap:8}}>
          <Link to="/" style={{color:'#fff'}}>Resumen</Link>
          <Link to="/siembra" style={{color:'#fff'}}>Siembra</Link>
          <Link to="/cosecha" style={{color:'#fff'}}>Cosecha</Link>
          <Link to="/procesamiento" style={{color:'#fff'}}>Recepción/Proc.</Link>
          <Link to="/config" style={{color:'#fff'}}>Configuraciones</Link>
        </nav>
        <div style={{marginTop:24, fontSize:12}}>
          Sesión: {user?.email} {role ? `(${role})` : ''}
          <div><button onClick={onSignOut} style={{marginTop:6, background:'#fff', color:verde, padding:'6px 10px', borderRadius:6}}>Salir</button></div>
        </div>
      </aside>
      <main style={{padding:'20px'}}>
        <Routes>
          <Route path="/" element={<Resumen />} />
          <Route path="/siembra" element={<Siembra />} />
          <Route path="/cosecha" element={<Cosecha />} />
          <Route path="/procesamiento" element={<Procesamiento />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchRole() {
      if (!user?.email) { setRole(null); return }
      const { data } = await supabase.from('app.usuarios').select('rol').eq('email', user.email).maybeSingle()
      setRole(data?.rol || '')
    }
    fetchRole()
  }, [user])

  async function signOut(){ await supabase.auth.signOut(); nav('/login') }
  if (!user) return <Login />
  return <Shell user={user} role={role} onSignOut={signOut} />
}
