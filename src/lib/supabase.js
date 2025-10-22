// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Cliente normal con tus credenciales (ya definidas en Render)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// 👇 Cliente apuntando explícitamente al esquema "app"
export const db = supabase.schema('app')
