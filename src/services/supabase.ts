import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key são necessários.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AuthError = {
  message: string;
};

export async function signInWithEmail(email: string, password: string) {
  console.log('Tentando fazer login com:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro de login:', error);
    throw error;
  }

  console.log('Login bem sucedido:', data);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
  console.log('Logout bem sucedido');
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
  console.log('Usuário atual:', user);
  return user;
}

// Função para verificar se o usuário está autenticado
export async function isAuthenticated() {
  const user = await getCurrentUser();
  const isAuth = !!user;
  console.log('Estado de autenticação:', isAuth);
  return isAuth;
}
