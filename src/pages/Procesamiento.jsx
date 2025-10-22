import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Procesamiento(){
  const [cosechas, setCosechas] = useState([])
  const [form, setForm] = useState({ cosecha_id:'', kg_descartados:0, kg_recibidos:0 })
  const [alerta, setAlerta] = useState('')
  const [comentario, setComentario] = useState('')

  useEffect(()=>{ (async ()=>{ 
    const { data } = await supabase.from('app.cosechas').select('id,kg_cosechados').order('created_at',{ascending:false}).limit(50)
    setCosechas(data||[])
  })() }, [])

  function u(k,v){ setForm(s=>({...s,[k]:v})) }

  async function crear(e){
    e.preventDefault()
    let inconsistencia = false
    if (form.cosecha_id){
      const c = cosechas.find(x=>x.id===form.cosecha_id)
      if (c && Number(form.kg_recibidos||0) !== Number(c.kg_cosechados||0)){
        inconsistencia = true
        if (!comentario) return setAlerta('Hay inconsistencia entre lo cosechado y lo recibido. Explicá el motivo.')
      }
    }
    const ins = await supabase.from('app.procesamientos').insert({
      empresa_id: null,
      cosecha_id: form.cosecha_id || null,
      estado: 'abierto',
      inconsistencia,
      inconsistencia_comentario: comentario || null
    }).select('id').single()
    if (ins.error) return alert(ins.error.message)
    const pr = ins.data
    await supabase.from('app.procesamiento_totales').insert({
      procesamiento_id: pr.id,
      kg_recibidos: Number(form.kg_recibidos||0),
      kg_descartados: Number(form.kg_descartados||0)
    })
    alert('Procesamiento creado')
    setAlerta(''); setComentario(''); setForm({ cosecha_id:'', kg_descartados:0, kg_recibidos:0 })
  }

  return (
    <div>
      <h2>Recepción / Procesamiento</h2>
      <form onSubmit={crear} style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(280px, 1fr))', gap:12, maxWidth:900}}>
        <select value={form.cosecha_id} onChange={e=>u('cosecha_id', e.target.value)}>
          <option value="">Cosecha… (o dejar vacío si proveedor externo)</option>
          {cosechas.map(c=> <option key={c.id} value={c.id}>Cosecha #{c.id.slice(0,6)} — {c.kg_cosechados} kg</option>)}
        </select>
        <input step="0.1" type="number" placeholder="Kg recibidos" value={form.kg_recibidos} onChange={e=>u('kg_recibidos', e.target.value)} />
        <input step="0.1" type="number" placeholder="Kg descartados" value={form.kg_descartados} onChange={e=>u('kg_descartados', e.target.value)} />
        {alerta && <div style={{gridColumn:'1 / -1', color:'#b00020'}}>{alerta}</div>}
        <textarea placeholder="Motivo (si hay inconsistencia)" value={comentario} onChange={e=>setComentario(e.target.value)} style={{gridColumn:'1 / -1', minHeight:90}} />
        <button type="submit" style={{background:'#0a7a4b', color:'#fff', padding:'8px 12px', borderRadius:8}}>Guardar</button>
      </form>
    </div>
  )
}
