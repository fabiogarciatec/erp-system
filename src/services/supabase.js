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
    redirectTo: `${siteUrl}/reset-password`,
    storage: window.localStorage,
    storageKey: 'erp-auth-token',
    debug: import.meta.env.DEV
  }
})

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

export const getCurrentUser = async () => {
  try {
    const { data: session } = await supabase.auth.getSession()
    
    if (!session?.session) {
      console.log('Nenhuma sessão encontrada')
      return null
    }

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      if (error.name === 'AuthSessionMissingError') {
        console.log('Sessão não encontrada')
        return null
      }
      console.error('Erro ao obter usuário atual:', error)
      throw error
    }

    console.log('Usuário atual:', user)
    return user
  } catch (error) {
    if (error.name === 'AuthSessionMissingError') {
      console.log('Sessão não encontrada')
      return null
    }
    console.error('Erro ao obter usuário atual:', error)
    return null
  }
}

export const onAuthStateChange = (callback) => {
  console.log('Configurando listener de mudança de estado de autenticação...')
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Mudança de estado de autenticação:', event, session)
    callback(event, session)
  })
  return { unsubscribe: () => subscription.unsubscribe() }
}
