import { supabase } from './supabase';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  created_at?: string;
  last_purchase?: string | null;
  company_id?: number | null;
}

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

export async function createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>) {
  // Remover campos opcionais do objeto antes de enviar
  const { last_purchase, company_id, ...customer } = customerData;
  
  const { data, error } = await supabase
    .from('customers')
    .insert([{ ...customer, company_id: null }])
    .select()
    .single();

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao criar cliente: ' + error.message);
  }

  return data;
}

export async function updateCustomer(id: number, customer: Partial<Customer>) {
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

export async function deleteCustomer(id: number) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao excluir cliente: ' + error.message);
  }
}

export async function searchCustomers(query: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro completo:', error);
    throw new Error('Erro ao buscar clientes: ' + error.message);
  }

  return data;
}
