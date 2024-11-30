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
        .from('companies')
        .select('*')
        .single();

      if (error) throw error;

      setCompany(companyData);
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
      if (!company) return;

      const { error } = await supabase
        .from('companies')
        .upsert([company]);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Dados da empresa atualizados com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      fetchCompanyData(); // Recarrega os dados atualizados
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
