import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '../config/envNode';
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
}
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    db: {
        schema: 'public'
    }
});
