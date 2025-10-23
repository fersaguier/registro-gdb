// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Estas 2 variables VIENEN de Render (Environment)
// ⚠️ Deben llamarse EXACTO así:
const url  = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  console.error('[ENV] Faltan variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, anon)

// Usamos el esquema "app" (donde están las tablas)
export const db = supabase.schema('app')
