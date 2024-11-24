import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
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
  console.log('Tentando fazer logout')
  
  try {
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
