// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Siembra from './pages/Siembra'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display:'flex', minHeight:'100vh' }}>
        <aside style={{ width:260, background:'#046A38', color:'#fff', padding:24 }}>
          <h2 style={{ fontSize:18, fontWeight:'bold' }}>Registro de siembras y cosechas — GDB</h2>
          <nav style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
            <Link to="/siembra" style={{ color:'#fff', textDecoration:'none' }}>Siembra</Link>
          </nav>
          <div style={{ marginTop:'auto' }}>
            <p style={{ fontSize:13 }}>Sesión:<br/><strong>fernandosaguier@gmail.com</strong></p>
          </div>
        </aside>

        <main style={{ flex:1, padding:24 }}>
          <Routes>
            <Route path="/" element={<Siembra />} />
            <Route path="/siembra" element={<Siembra />} />
            <Route path="*" element={<Siembra />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
