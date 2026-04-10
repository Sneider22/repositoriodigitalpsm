import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ FALTAN VARIABLES DE ENTORNO DE SUPABASE.\n" +
    "Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas.\n" +
    "En Vercel: Settings > Environment Variables.\n" +
    "En local: archivo .env en la raíz del proyecto."
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true, // Reactivado para mantener sesión en móviles y escritorio
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
