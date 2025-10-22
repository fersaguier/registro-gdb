import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Resumen(){
  const [rows, setRows] = useState([])

  useEffect(()=>{ (async ()=>{ 
    const { data } = await supabase.from('app.v_export_plano').select('*').limit(200)
    setRows(data||[])
  })() }, [])

  return (
    <div>
      <h2>Resumen Gerencial (vista plana)</h2>
      <div style={{overflowX:'auto'}}>
        <table border="1" cellPadding="6" style={{borderCollapse:'collapse', minWidth:900}}>
          <thead>
            <tr>
              <th>Empresa</th><th>Código</th><th>Producto</th><th>Variedad</th><th>Inv</th>
              <th>F. Siembra</th><th>F. Cosecha</th><th>Plantas</th><th>Kg Cosechados</th><th>Kg Desc.</th><th>Kg Aprov.</th><th>g/planta</th><th>Remisión</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                <td>{r.empresa}</td>
                <td>{r.codigo_unico}</td>
                <td>{r.producto_codigo}</td>
                <td>{r.variedad_nombre}</td>
                <td>{r.invernadero_codigo}</td>
                <td>{r.fecha_siembra}</td>
                <td>{r.fecha_cosecha}</td>
                <td>{r.plantas_cosechadas}</td>
                <td>{r.kg_cosechados}</td>
                <td>{r.kg_descartados}</td>
                <td>{r.kg_aprovechados}</td>
                <td>{r.gramos_por_planta}</td>
                <td>{r.remision_numero}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
