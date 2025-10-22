import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Cosecha(){
  const [siembras, setSiembras] = useState([])
  const [form, setForm] = useState({ siembra_id:'', fecha_cosecha:'', plantas_cosechadas:0, kg_cosechados:0 })

  useEffect(()=>{ (async ()=>{ 
    const { data } = await supabase.from('app.siembras').select('id,codigo_lote').eq('activa', true).order('created_at', { ascending:false })
    setSiembras(data||[])
  })() }, [])

  function u(k,v){ setForm(s=>({...s,[k]:v})) }

  async function crear(e){
    e.preventDefault()
    const { error } = await supabase.from('app.cosechas').insert({
      siembra_id: form.siembra_id,
      fecha_cosecha: form.fecha_cosecha,
      plantas_cosechadas: form.plantas_cosechadas||null,
      kg_cosechados: form.kg_cosechados||0
    })
    if (error) alert(error.message)
    else alert('Cosecha registrada')
  }

  return (
    <div>
      <h2>Registrar cosecha</h2>
      <form onSubmit={crear} style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(280px, 1fr))', gap:12, maxWidth:900}}>
        <select required value={form.siembra_id} onChange={e=>u('siembra_id', e.target.value)}>
          <option value="">Siembra…</option>
          {siembras.map(s=> <option key={s.id} value={s.id}>{s.codigo_lote}</option>)}
        </select>
        <input required type="date" value={form.fecha_cosecha} onChange={e=>u('fecha_cosecha', e.target.value)} />
        <input type="number" placeholder="Plantas cosechadas" value={form.plantas_cosechadas} onChange={e=>u('plantas_cosechadas', e.target.value)} />
        <input step="0.1" type="number" placeholder="Kg cosechados" value={form.kg_cosechados} onChange={e=>u('kg_cosechados', e.target.value)} />
        <button type="submit" style={{background:'#0a7a4b', color:'#fff', padding:'8px 12px', borderRadius:8}}>Registrar</button>
      </form>
    </div>
  )
}
