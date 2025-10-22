// src/pages/App.jsx
import React from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Siembra from "./Siembra"

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "260px",
            backgroundColor: "#046A38",
            color: "#fff",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
            Registro de siembras y cosechas — GDB
          </h2>
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              Resumen
            </Link>
            <Link to="/siembra" style={{ color: "#fff", textDecoration: "none" }}>
              Siembra
            </Link>
            <Link to="/cosecha" style={{ color: "#fff", textDecoration: "none" }}>
              Cosecha
            </Link>
            <Link to="/procesamiento" style={{ color: "#fff", textDecoration: "none" }}>
              Recepción/Proc.
            </Link>
            <Link to="/config" style={{ color: "#fff", textDecoration: "none" }}>
              Configuraciones
            </Link>
          </nav>

          <div style={{ marginTop: "auto" }}>
            <p style={{ fontSize: "13px" }}>
              Sesión: <br />
              <strong>fernandosaguier@gmail.com</strong>
            </p>
            <button
              style={{
                marginTop: "8px",
                background: "#fff",
                color: "#046A38",
                border: "none",
                borderRadius: "4px",
                padding: "4px 10px",
                cursor: "pointer",
              }}
              onClick={() => alert("Cerrar sesión aún no implementado")}
            >
              Salir
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main style={{ flex: 1, padding: "24px" }}>
          <Routes>
            <Route path="/siembra" element={<Siembra />} />
            <Route path="/" element={<Siembra />} /> {/* Página por defecto */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
