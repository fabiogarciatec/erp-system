import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env file');
}

// Função para criar headers com o token
const createHeaders = (token?: string) => ({
  global: {
    headers: {
      'x-application-name': 'erp-system',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }
});

// Criar cliente Supabase com configuração inicial
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: window.localStorage,
    storageKey: 'erp-auth-token'
  },
  ...createHeaders()
});

// Configurar listener para mudanças de autenticação
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    const accessToken = session?.access_token;
    if (accessToken) {
      localStorage.setItem('erp-access-token', accessToken);
      
      // Recriar cliente com novo token
      Object.assign(supabase, createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: window.localStorage,
          storageKey: 'erp-auth-token'
        },
        ...createHeaders(accessToken)
      }));
    }
  } else if (event === 'SIGNED_OUT') {
    localStorage.removeItem('erp-access-token');
    localStorage.removeItem('erp-auth-token');
    localStorage.removeItem('erp-user-data');
    
    // Recriar cliente sem token
    Object.assign(supabase, createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        storage: window.localStorage,
        storageKey: 'erp-auth-token'
      },
      ...createHeaders()
    }));
  } else if (event === 'TOKEN_REFRESHED' && session) {
    const accessToken = session.access_token;
    if (accessToken) {
      localStorage.setItem('erp-access-token', accessToken);
      
      // Recriar cliente com novo token
      Object.assign(supabase, createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: window.localStorage,
          storageKey: 'erp-auth-token'
        },
        ...createHeaders(accessToken)
      }));
    }
  }
});

// Verificar e configurar token existente ao inicializar
const existingToken = localStorage.getItem('erp-access-token');
if (existingToken) {
  Object.assign(supabase, createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: window.localStorage,
      storageKey: 'erp-auth-token'
    },
    ...createHeaders(existingToken)
  }));
}

export default supabase;
