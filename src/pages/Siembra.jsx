// src/pages/Siembra.jsx
import React, { useEffect, useState } from 'react'
import { db } from '../lib/supabase'

export default function Siembra() {
  const [empresas, setEmpresas] = useState([])
  const [productos, setProductos] = useState([])
  const [variedades, setVariedades] = useState([])
  const [invernaderos, setInvernaderos] = useState([])

  const [empresaId, setEmpresaId] = useState('')
  const [productoId, setProductoId] = useState('')
  const [variedadId, setVariedadId] = useState('')
  const [invernaderoId, setInvernaderoId] = useState('')

  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0,10))
  const [plantas, setPlantas] = useState(0)
  const [hidro, setHidro] = useState(false)
  const [msg, setMsg] = useState('')
console.log('[ENV]', import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0,8)+'...')

  useEffect(() => {
    (async () => {
      const { data, error } = await db
        .from('empresas')
        .select('id, nombre, codigo')
        .order('codigo')
      if (!error) setEmpresas(data || [])
    })()
  }, [])

  useEffect(() => {
    if (!empresaId) return
    ;(async () => {
      const [{ data: prods }, { data: invs }] = await Promise.all([
        db.from('productos').select('id, nombre, codigo').eq('empresa_id', empresaId),
        db.from('invernaderos').select('id, nombre, codigo').eq('empresa_id', empresaId),
      ])
      setProductos(prods || [])
      setInvernaderos(invs || [])
    })()
  }, [empresaId])

  useEffect(() => {
    if (!productoId) return
    ;(async () => {
      const { data } = await db
        .from('variedades')
        .select('id, nombre, codigo')
        .eq('producto_id', productoId)
      setVariedades(data || [])
    })()
  }, [productoId])

  async function crearSiembra(e) {
    e.preventDefault()
    if (!empresaId || !productoId || !variedadId || !invernaderoId) {
      setMsg('⚠️ Faltan campos obligatorios')
      return
    }
    const { error } = await db.from('siembras').insert({
      empresa_id: empresaId,
      producto_id: productoId,
      variedad_id: variedadId,
      invernadero_id: invernaderoId,
      fecha_siembra: fecha,
      plantas: plantas || 0,
      hidroponia: hidro,
    })
    if (error) setMsg('❌ Error: ' + error.message)
    else setMsg('✅ Siembra registrada correctamente')
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2>Crear siembra</h2>

      <form onSubmit={crearSiembra} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <select value={empresaId} onChange={e => setEmpresaId(e.target.value)}>
          <option value="">Empresa...</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>
              {e.codigo} — {e.nombre}
            </option>
          ))}
        </select>

        <select value={productoId} onChange={e => setProductoId(e.target.value)}>
          <option value="">Producto...</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>
              {p.codigo} — {p.nombre}
            </option>
          ))}
        </select>

        <select value={variedadId} onChange={e => setVariedadId(e.target.value)}>
          <option value="">Variedad...</option>
          {variedades.map(v => (
            <option key={v.id} value={v.id}>
              {v.codigo} — {v.nombre}
            </option>
          ))}
        </select>

        <select value={invernaderoId} onChange={e => setInvernaderoId(e.target.value)}>
          <option value="">Invernadero...</option>
          {invernaderos.map(i => (
            <option key={i.id} value={i.id}>
              {i.codigo} — {i.nombre}
            </option>
          ))}
        </select>

        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <input
          type="number"
          placeholder="Plantas"
          value={plantas}
          onChange={e => setPlantas(e.target.value)}
        />

        <label style={{ gridColumn: '1 / -1' }}>
          <input type="checkbox" checked={hidro} onChange={e => setHidro(e.target.checked)} /> Hidroponía
        </label>

        <button
          type="submit"
          style={{
            gridColumn: '1 / -1',
            backgroundColor: '#046A38',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: 6,
          }}
        >
          Crear
        </button>
      </form>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  )
}
