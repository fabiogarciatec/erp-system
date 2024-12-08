import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: localStorage
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'x-application-name': 'erp-system'
        }
    }
});
