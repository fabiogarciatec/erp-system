import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

// Tipos para o banco de dados
export interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  empresa_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Empresa {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  empresa_id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  created_at?: string;
  updated_at?: string;
}
