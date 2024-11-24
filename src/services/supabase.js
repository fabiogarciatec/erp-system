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

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
)

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
  console.log('Tentando fazer logout')
  
  try {
    // Primeiro verifica se há uma sessão ativa
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      console.log('Nenhuma sessão ativa encontrada')
      // Limpa qualquer dado residual de sessão
      window.localStorage.removeItem('supabase.auth.token')
      return { error: null }
    }

    // Procede com o logout
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erro no signOut:', error)
      throw error
    }

    // Limpa manualmente o storage após o logout
    window.localStorage.removeItem('supabase.auth.token')
    console.log('Logout bem sucedido')
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    // Em caso de erro de sessão ausente, limpa o storage
    if (error.message.includes('Auth session missing')) {
      window.localStorage.removeItem('supabase.auth.token')
      return { error: null }
    }
    return { error }
  }
}

export const getCurrentUser = async () => {
  console.log('Obtendo usuário atual')
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erro ao obter sessão:', error)
      throw error
    }

    if (!session) {
      console.log('Nenhuma sessão encontrada')
      return null
    }

    console.log('Sessão encontrada:', session)
    return session.user
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    throw error
  }
}

export const onAuthStateChange = (callback) => {
  console.log('Configurando listener de mudança de autenticação')
  
  try {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Mudança de estado de autenticação:', { event, session })
      callback(event, session)
    })

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao configurar listener de autenticação:', error)
    return { data: null, error }
  }
}
