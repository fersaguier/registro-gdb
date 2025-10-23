// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Deben existir estas 2 variables en Render:
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, anon)

// 👇 MUY IMPORTANTE: usar el esquema "app"
export const db = supabase.schema('app')
