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
  const [plantas, setPlantas] = useState(0)
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0,10))
  const [hidro, setHidro] = useState(false)

  const [status, setStatus] = useState('Cargando…')
  const [error, setError] = useState('')

  // Carga inicial: EMPRESAS
  useEffect(() => {
    (async () => {
      setStatus('Cargando empresas…')
      const { data, error } = await db
        .from('empresas')
        .select('id, nombre, codigo')
        .order('codigo', { ascending: true })
      if (error) {
        console.error('empresas error:', error)
        setError('No pude leer empresas: ' + error.message)
      } else {
        setEmpresas(data || [])
        setStatus('')
      }
    })()
  }, [])

  // Al elegir EMPRESA: PRODUCTOS + INVERNADEROS
  useEffect(() => {
    if (!empresaId) return
    ;(async () => {
      setStatus('Cargando productos e invernaderos…')
      const [{ data: prods, error: e1 }, { data: invs, error: e2 }] = await Promise.all([
        db.from('productos').select('id, nombre, codigo').eq('empresa_id', empresaId).order('codigo'),
        db.from('invernaderos').select('id, nombre, codigo').eq('empresa_id', empresaId).order('codigo'),
      ])
      if (e1 || e2) {
        console.error('productos/invernaderos error:', e1 || e2)
        setError('No pude leer productos/invernaderos.')
      } else {
        setProductos(prods || [])
        setInvernaderos(invs || [])
      }
      setProductoId('')
      setVariedadId('')
      setInvernaderoId('')
      setStatus('')
    })()
  }, [empresaId])

  // Al elegir PRODUCTO: VARIEDADES
  useEffect(() => {
    if (!productoId) return
    ;(async () => {
      setStatus('Cargando variedades…')
      const { data, error } = await db
        .from('variedades')
        .select('id, nombre, codigo')
        .eq('producto_id', productoId)
        .order('codigo')
      if (error) {
        console.error('variedades error:', error)
        setError('No pude leer variedades.')
      } else {
        setVariedades(data || [])
      }
      setVariedadId('')
      setStatus('')
    })()
  }, [productoId])

  async function crearSiembra(e) {
    e.preventDefault()
    setError('')
    if (!empresaId || !productoId || !variedadId || !invernaderoId) {
      setError('⚠️ Faltan campos obligatorios')
      return
    }
    setStatus('Guardando…')
    const { error } = await db.from('siembras').insert({
      empresa_id: empresaId,
      producto_id: productoId,
      variedad_id: variedadId,
      invernadero_id: invernaderoId,
      fecha_siembra: fecha,
      plantas: Number(plantas) || 0,
      hidroponia: !!hidro,
    })
    if (error) {
      console.error('insert error:', error)
      setError('No pude guardar: ' + error.message)
    } else {
      setStatus('✅ Siembra registrada')
      setTimeout(() => setStatus(''), 2000)
    }
  }

  return (
    <div>
      <h2>Crear siembra</h2>

      {(status || error) && (
        <div style={{marginBottom:12}}>
          {status && <div>{status}</div>}
          {error && <div style={{color:'#b00020'}}>{error}</div>}
        </div>
      )}

      <form onSubmit={crearSiembra} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Empresa */}
        <select value={empresaId} onChange={e => setEmpresaId(e.target.value)}>
          <option value="">Empresa…</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>{e.codigo} — {e.nombre}</option>
          ))}
        </select>

        {/* Producto */}
        <select value={productoId} onChange={e => setProductoId(e.target.value)}>
          <option value="">Producto…</option>
          {productos.map(p => (
            <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>
          ))}
        </select>

        {/* Variedad */}
        <select value={variedadId} onChange={e => setVariedadId(e.target.value)}>
          <option value="">Variedad…</option>
          {variedades.map(v => (
            <option key={v.id} value={v.id}>{v.codigo} — {v.nombre}</option>
          ))}
        </select>

        {/* Invernadero */}
        <select value={invernaderoId} onChange={e => setInvernaderoId(e.target.value)}>
          <option value="">Invernadero…</option>
          {invernaderos.map(i => (
            <option key={i.id} value={i.id}>{i.codigo} — {i.nombre}</option>
          ))}
        </select>

        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        <input type="number" value={plantas} onChange={e => setPlantas(e.target.value)} placeholder="Plantas" />

        <label style={{ gridColumn: '1 / -1' }}>
          <input type="checkbox" checked={hidro} onChange={e => setHidro(e.target.checked)} /> Hidroponía
        </label>

        <button type="submit" style={{ gridColumn: '1 / -1', background:'#046A38', color:'#fff', border:'none', borderRadius:6, padding:'10px' }}>
          Crear
        </button>
      </form>
    </div>
  )
}
