import supabase from '@/lib/supabase';
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
export async function createCustomer(customerData) {
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
export async function searchCustomers(query) {
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
export async function updateCustomer(id, customer) {
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
export async function deleteCustomer(id) {
    const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Erro completo:', error);
        throw new Error('Erro ao excluir cliente: ' + error.message);
    }
}
