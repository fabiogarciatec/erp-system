import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface State {
  id: number;
  name: string;
  uf: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state_id: number;
  postal_code: string;
  created_at: string;
  updated_at: string;
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

  useEffect(() => {
    fetchCompanyData();
    fetchStates();
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      if (!user) return;

      const { data: companyData, error } = await supabase
        .from('user_companies')
        .select(`
          companies (
            id,
            name,
            email,
            phone,
            address,
            city,
            state_id,
            postal_code,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      console.log('Dados retornados do Supabase:', companyData);

      // Se não houver dados, retorna null
      if (!companyData?.companies) {
        setCompany(null);
        return;
      }

      // Pega o primeiro item do array de empresas
      const companyInfo = Array.isArray(companyData.companies) 
        ? companyData.companies[0] 
        : companyData.companies;

      console.log('Dados da empresa:', companyInfo);
      
      setCompany(companyInfo as Company);
    } catch (error: any) {
      console.error('Error fetching company data:', error.message);
      toast({
        title: 'Erro ao carregar dados da empresa',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const { data: statesData, error } = await supabase
        .from('states')
        .select('*')
        .order('name');

      if (error) throw error;

      setStates(statesData || []);
    } catch (error: any) {
      console.error('Error fetching states:', error.message);
      toast({
        title: 'Erro ao carregar estados',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field: keyof Company, value: string | number) => {
    if (!company) return;
    setCompany({ ...company, [field]: value });
  };

  const handleSave = async () => {
    try {
      if (!company || !user) return;

      // Primeiro, atualiza os dados da empresa
      const { error: companyError } = await supabase
        .from('companies')
        .upsert([{
          id: company.id,
          name: company.name,
          email: company.email,
          phone: company.phone,
          address: company.address,
          city: company.city,
          state_id: company.state_id,
          postal_code: company.postal_code
        }]);

      if (companyError) throw companyError;

      // Se for uma nova empresa, cria a relação user_companies
      if (!company.id) {
        const { data: newCompany } = await supabase
          .from('companies')
          .select('id')
          .eq('email', company.email)
          .single();

        if (newCompany) {
          const { error: relationError } = await supabase
            .from('user_companies')
            .insert([{
              user_id: user.id,
              company_id: newCompany.id,
              is_owner: true
            }]);

          if (relationError) throw relationError;
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Dados da empresa atualizados com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Recarrega os dados atualizados
      await fetchCompanyData();
    } catch (error: any) {
      console.error('Error saving company data:', error.message);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return {
    company,
    states,
    isLoading,
    handleInputChange,
    handleSave,
  };
}
