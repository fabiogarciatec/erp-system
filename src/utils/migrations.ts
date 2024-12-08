import { supabase } from '../services/supabase';

export async function checkAndCreateCompany(userId: string) {
  try {
    // Primeiro, verifica se o usuário já tem uma empresa associada
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (profile?.company_id) {
      return profile.company_id;
    }

    // Se não tem empresa, cria uma nova
    const { data: company, error: createError } = await supabase
      .from('companies')
      .insert([{
        name: '',
        tax_id: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        email: '',
        website: '',
      }])
      .select()
      .single();

    if (createError) throw createError;

    // Atualiza o perfil com o ID da nova empresa
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ company_id: company.id })
      .eq('id', userId);

    if (updateError) throw updateError;

    return company.id;
  } catch (error) {
    console.error('Error checking/creating company:', error);
    return null;
  }
}
