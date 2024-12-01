import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@chakra-ui/react';
import { Company } from '@/types/company';

interface State {
  id: number;
  name: string;
  uf: string;
}

interface CompanyResponse {
  companies: Company | Company[];
}

export function useCompanyData() {
  const { user } = useAuth();
  const toast = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = async () => {
    try {
      if (!user) return;

      const { data: companyData, error } = await supabase
        .from('user_companies')
        .select(`
          companies (
            id,
            name,
            document,
            email,
            phone,
            address,
            address_number,
            address_complement,
            neighborhood,
            city,
            state_id,
            postal_code,
            created_at,
            updated_at,
            latitude,
            longitude
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (companyData?.companies) {
        // Garantindo que os dados correspondam à interface Company
        const companyInfo = Array.isArray(companyData.companies)
          ? companyData.companies[0]
          : companyData.companies;

        const company: Company = {
          id: companyInfo.id,
          name: companyInfo.name,
          document: companyInfo.document,
          email: companyInfo.email,
          phone: companyInfo.phone,
          address: companyInfo.address || '',
          address_number: companyInfo.address_number || '',
          address_complement: companyInfo.address_complement || '',
          neighborhood: companyInfo.neighborhood || '',
          city: companyInfo.city || '',
          state_id: companyInfo.state_id,
          postal_code: companyInfo.postal_code || '',
          created_at: companyInfo.created_at,
          updated_at: companyInfo.updated_at,
          latitude: companyInfo.latitude || null,
          longitude: companyInfo.longitude || null
        };

        setCompany(company);
      }
    } catch (error: any) {
      console.error('Error fetching company data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
    fetchStates();
  }, [user]);

  const fetchStates = async () => {
    try {
      const { data: states } = await supabase
        .from('states')
        .select('*')
        .order('name');
      if (states) setStates(states);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const saveCompany = async () => {
    try {
      if (!company || !user) return;

      const { error: companyError } = await supabase
        .from('companies')
        .upsert([{
          id: company.id,
          name: company.name,
          document: company.document,
          email: company.email,
          phone: company.phone,
          address: company.address,
          address_number: company.address_number,
          address_complement: company.address_complement,
          neighborhood: company.neighborhood,
          city: company.city,
          state_id: company.state_id,
          postal_code: company.postal_code,
          latitude: company.latitude,
          longitude: company.longitude
        }]);

      if (companyError) throw companyError;

      return true;
    } catch (error) {
      console.error('Error saving company:', error);
      throw error;
    }
  };

  const updateCompanyData = async (field: keyof Company, value: any) => {
    if (!company) return;

    try {
      const { error } = await supabase
        .from('companies')
        .update({ [field]: value })
        .eq('id', company.id);

      if (error) throw error;

      setCompany({
        ...company,
        [field]: value
      });
    } catch (error) {
      console.error('Error updating company data:', error);
      setError('Erro ao atualizar dados da empresa');
    }
  };

  const handleInputChange = async (field: keyof Company, value: string | number) => {
    if (!company) return;

    try {
      // Converte valores vazios para campos numéricos em 0
      const finalValue = (field === 'latitude' || field === 'longitude' || field === 'state_id') && value === ''
        ? 0
        : value;

      // Atualiza o estado local primeiro
      setCompany({ ...company, [field]: finalValue });

      // Atualiza o banco de dados
      const { error } = await supabase
        .from('companies')
        .update({ [field]: finalValue })
        .eq('id', company.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating company data:', error);
      toast({
        title: 'Erro!',
        description: 'Erro ao atualizar dados da empresa.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCompany();
      toast({
        title: 'Sucesso!',
        description: 'Dados da empresa atualizados com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      await fetchCompanyData();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: 'Erro!',
        description: 'Erro ao salvar dados da empresa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    company,
    states,
    isLoading,
    isSaving,
    error,
    handleInputChange,
    handleSave,
    fetchCompanyData,
  };
}
