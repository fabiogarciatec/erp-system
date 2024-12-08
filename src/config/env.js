// Configurações do Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Validação das variáveis de ambiente
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
}
