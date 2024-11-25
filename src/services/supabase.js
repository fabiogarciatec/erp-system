import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Environment Check:', {
  mode: import.meta.env.MODE,
  supabaseUrl: supabaseUrl ? 'Defined' : 'Undefined',
  supabaseKey: supabaseAnonKey ? 'Defined' : 'Undefined'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não configuradas:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
}

// URL base da aplicação para redirecionamentos
const siteUrl = import.meta.env.MODE === 'production' 
  ? 'https://erp-system-fabio.netlify.app'  // URL do seu site no Netlify
  : 'http://localhost:5173'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'erp-auth-token',
    debug: true // Ativando debug para todos os ambientes temporariamente
  }
})

// Função para enviar email de recuperação de senha
export const sendPasswordResetEmail = async (email) => {
  console.log('Enviando email de recuperação para:', email)
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`
    })
    
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error)
    return { error }
  }
}

export const signIn = async (email, password) => {
  console.log('Tentando fazer login com email:', email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Erro no signIn:', error)
      throw error
    }

    console.log('Login bem sucedido:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  try {
    console.log('Tentando fazer logout...')
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erro no signOut:', error)
      throw error
    }

    console.log('Logout bem sucedido')
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return { error }
  }
}

// Função para forçar atualização do token
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      console.error('Erro ao obter sessão:', error);
      return null;
    }

    // Força a atualização do token
    const { data, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Erro ao atualizar sessão:', refreshError);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Erro ao atualizar sessão:', error);
    return null;
  }
};

// Função para obter o usuário atual
export const getCurrentUser = async () => {
  try {
    // Primeiro tenta atualizar a sessão
    const session = await refreshSession();
    if (!session) {
      console.log('Não foi possível atualizar a sessão');
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};

// Função para verificar se a sessão está ativa
export const checkSession = async () => {
  try {
    // Primeiro tenta atualizar a sessão
    const session = await refreshSession();
    if (!session) {
      return null;
    }

    // Verifica se a sessão existe e não está expirada
    if (!session.access_token || !session.expires_at) {
      console.log('Sessão inválida');
      return null;
    }

    // Verifica se o token está expirado
    const expiresAt = new Date(session.expires_at * 1000);
    if (expiresAt <= new Date()) {
      console.log('Sessão expirada');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return null;
  }
};

export const onAuthStateChange = (callback) => {
  console.log('Configurando listener de mudança de estado de autenticação...')
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Mudança de estado de autenticação:', event, session)
    callback(event, session)
  })
  return { unsubscribe: () => subscription.unsubscribe() }
}
