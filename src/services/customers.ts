import supabase from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao buscar clientes: ' + error.message);
  }

  return data;
}

export async function createCustomer(customerData: CustomerInsert) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao criar cliente: ' + error.message);
  }

  return data;
}

export async function searchCustomers(query: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`nome.ilike.%${query}%,email.ilike.%${query}%,telefone.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao buscar clientes: ' + error.message);
  }

  return data;
}

export async function updateCustomer(id: string, customer: CustomerUpdate) {
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao atualizar cliente: ' + error.message);
  }

  return data;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao excluir cliente: ' + error.message);
  }
}

export type { Customer, CustomerInsert, CustomerUpdate };
