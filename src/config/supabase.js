import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xkgxnxlqybfcbxpqsqhw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZ3hueGxxeWJmY2J4cHFzcWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg5NjQzMjAsImV4cCI6MjAxNDU0MDMyMH0.xgkr_RFCcQbFcHVYy7cfPXzeLxoZJQ5_ZHq_jB9OHLw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções auxiliares para autenticação
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session?.user ?? null
}

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}
