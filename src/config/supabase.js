import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xkgxnxlqybfcbxpqsqhw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hueGxxeWJmY2J4cHFzcWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg5NjQzMjAsImV4cCI6MjAxNDU0MDMyMH0.xgkr_RFCcQbFcHVYy7cfPXzeLxoZJQ5_ZHq_jB9OHLw'

// Opções de configuração do Supabase
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}

// Criação do cliente Supabase com opções
export const supabase = createClient(supabaseUrl, supabaseKey, supabaseOptions)

// Funções auxiliares para autenticação
export const signIn = async (email, password) => {
  try {
    console.log('Tentando fazer login com:', { email })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Erro no login:', error)
      throw error
    }
    
    console.log('Login bem-sucedido:', data)
    return data
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw new Error(error.message || 'Erro ao conectar com o servidor')
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    throw new Error(error.message || 'Erro ao conectar com o servidor')
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Erro ao obter sessão:', error)
      throw error
    }
    return session?.user ?? null
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    throw new Error(error.message || 'Erro ao conectar com o servidor')
  }
}

export const onAuthStateChange = (callback) => {
  try {
    return supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Mudança de estado de autenticação:', { event: _event, session })
      callback(session?.user ?? null)
    })
  } catch (error) {
    console.error('Erro ao monitorar estado de autenticação:', error)
    throw new Error(error.message || 'Erro ao conectar com o servidor')
  }
}
