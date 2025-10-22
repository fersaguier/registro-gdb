import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Siembra() {
  const [empresas, setEmpresas] = useState([])
  const [productos, setProductos] = useState([])
  const [variedades, setVariedades] = useState([])
  const [invernaderos, setInvernaderos] = useState([])
  const [form, setForm] = useState({ empresa_id:'', producto_id:'', variedad_id:'', invernadero_id:'', fecha_siembra:'', plantas_sembradas:0, es_hidro:false })

  useEffect(() => { (async () => {
    const e = await supabase.from('app.empresas').select('*').order('nombre')
    setEmpresas(e.data||[])
  })() }, [])

  useEffect(() => { (async () => {
    if(!form.empresa_id) return setProductos([])
    const p=await supabase.from('app.productos').select('*').eq('empresa_id', form.empresa_id).order('nombre')
    setProductos(p.data||[])
  })() }, [form.empresa_id])

  useEffect(() => { (async () => {
    if(!form.producto_id) return setVariedades([])
    const v=await supabase.from('app.variedades').select('*').eq('producto_id', form.producto_id).order('nombre')
    setVariedades(v.data||[])
  })() }, [form.producto_id])

  useEffect(() => { (async () => {
    if(!form.empresa_id) return setInvernaderos([])
    const i=await supabase.from('app.invernaderos').select('*').eq('empresa_id', form.empresa_id).order('codigo')
    setInvernaderos(i.data||[])
  })() }, [form.empresa_id])

  function u(k,v){ setForm(s=>({...s,[k]:v})) }

  async function crear(e){
    e.preventDefault()
    const prod = productos.find(p=>p.id===form.producto_id)
    const variedad = variedades.find(v=>v.id===form.variedad_id)
    const inv = invernaderos.find(i=>i.id===form.invernadero_id)
    if(!prod||!variedad||!inv) return alert('Seleccioná producto/variedad/invernadero')

    const dt = new Date(form.fecha_siembra)
    const tmp = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()))
    const dayNum = tmp.getUTCDay() || 7; tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1))
    const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1)/7)
    const yy = String(dt.getFullYear()).slice(-2), ss = String(weekNo).padStart(2,'0'), dd = String(dt.getDate()).padStart(2,'0')
    const codigo = `${prod.codigo}-${yy}${ss}${dd}-${variedad.codigo}-${inv.codigo}`

    const { error } = await supabase.from('app.siembras').insert({
      empresa_id: form.empresa_id,
      producto_id: form.producto_id,
      variedad_id: form.variedad_id,
      invernadero_id: form.invernadero_id,
      fecha_siembra: form.fecha_siembra,
      plantas_sembradas: form.plantas_sembradas||null,
      es_hidro: form.es_hidro,
      codigo_lote: codigo,
      activa: true
    })
    if(error) alert(error.message)
    else { alert('Siembra creada: '+codigo); setForm({ empresa_id:'', producto_id:'', variedad_id:'', invernadero_id:'', fecha_siembra:'', plantas_sembradas:0, es_hidro:false }) }
  }

  return (
    <div>
      <h2>Crear siembra</h2>
      <form onSubmit={crear} style={{display:'grid', gridTemplateColumns:'repeat(2, minmax(280px, 1fr))', gap:12, maxWidth:900}}>
        <select required value={form.empresa_id} onChange={e=>u('empresa_id', e.target.value)}>
          <option value="">Empresa…</option>
          {empresas.map(x=> <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
        <select required value={form.producto_id} onChange={e=>u('producto_id', e.target.value)}>
          <option value="">Producto…</option>
          {productos.map(x=> <option key={x.id} value={x.id}>{x.nombre} ({x.codigo})</option>)}
        </select>
        <select required value={form.variedad_id} onChange={e=>u('variedad_id', e.target.value)}>
          <option value="">Variedad…</option>
          {variedades.map(x=> <option key={x.id} value={x.id}>{x.nombre} ({x.codigo})</option>)}
        </select>
        <select required value={form.invernadero_id} onChange={e=>u('invernadero_id', e.target.value)}>
          <option value="">Invernadero…</option>
          {invernaderos.map(x=> <option key={x.id} value={x.id}>#{x.codigo} - {x.nombre}</option>)}
        </select>
        <input required type="date" value={form.fecha_siembra} onChange={e=>u('fecha_siembra', e.target.value)} />
        <input type="number" placeholder="Plantas sembradas" value={form.plantas_sembradas} onChange={e=>u('plantas_sembradas', e.target.value)} />
        <label><input type="checkbox" checked={form.es_hidro} onChange={e=>u('es_hidro', e.target.checked)} /> Hidroponía</label>
        <button type="submit" style={{background:'#0a7a4b', color:'#fff', padding:'8px 12px', borderRadius:8}}>Crear</button>
      </form>
    </div>
  )
}
