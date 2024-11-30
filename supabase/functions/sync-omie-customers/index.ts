import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { OmieAPI } from '../../../omie_api'

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize Omie API
    const omie = new OmieAPI()
    
    // Get customers from Omie
    const response = await omie.listar_clientes(1, 500)
    
    if (!response.success || !response.data) {
      throw new Error('Failed to fetch customers from Omie')
    }

    const { data: customers, error } = await supabaseClient
      .from('omie_clientes')
      .upsert(
        response.data.clientes_cadastro.map(cliente => ({
          codigo_cliente_omie: cliente.codigo_cliente_omie,
          razao_social: cliente.razao_social,
          cnpj_cpf: cliente.cnpj_cpf,
          email: cliente.email,
          telefone1_ddd: cliente.telefone1_ddd,
          telefone1_numero: cliente.telefone1_numero,
          cidade: cliente.cidade,
          estado: cliente.estado,
          status_cliente: cliente.status_cliente
        })),
        { onConflict: 'codigo_cliente_omie' }
      )

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Customers synced successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
