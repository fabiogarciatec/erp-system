import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
import { supabase } from '../../services/supabase';
import { useProfile } from '../../hooks/useProfile';

interface CompanyData {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

export default function Company() {
  const toast = useToast();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyData | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchCompanyData();
    }
  }, [profile]);

  const fetchCompanyData = async () => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', profile?.id)
        .single();

      if (userData?.company_id) {
        const { data: companyData, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', userData.company_id)
          .single();

        if (error) throw error;

        setCompany(companyData);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast({
        title: 'Erro ao carregar dados da empresa',
        description: 'Por favor, tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', profile?.id)
        .single();

      if (userData?.company_id && company) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: company.name,
            cnpj: company.cnpj,
            address: company.address,
            city: company.city,
            state: company.state,
            phone: company.phone,
            email: company.email,
          })
          .eq('id', userData.company_id);

        if (error) throw error;

        toast({
          title: 'Dados atualizados',
          description: 'Os dados da empresa foram atualizados com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating company data:', error);
      toast({
        title: 'Erro ao atualizar dados',
        description: 'Por favor, tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box w="full" p={8}>
        <PageHeader
          title="Empresa"
          subtitle="Gerencie os dados da sua empresa"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Configurações', href: '/settings' },
            { label: 'Empresa', href: '/settings/company' }
          ]}
        />
        <Box display="flex" justifyContent="center" mt={8}>
          <Spinner size="xl" />
        </Box>
      </Box>
    );
  }

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Empresa"
        subtitle="Gerencie os dados da sua empresa"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/settings' },
          { label: 'Empresa', href: '/settings/company' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Nome da Empresa</FormLabel>
              <Input
                value={company?.name || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, name: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>CNPJ</FormLabel>
              <Input
                value={company?.cnpj || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, cnpj: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Endereço</FormLabel>
              <Input
                value={company?.address || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, address: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cidade</FormLabel>
              <Input
                value={company?.city || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, city: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Estado</FormLabel>
              <Input
                value={company?.state || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, state: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Telefone</FormLabel>
              <Input
                value={company?.phone || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, phone: e.target.value }))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>E-mail</FormLabel>
              <Input
                value={company?.email || ''}
                onChange={(e) => setCompany(prev => ({ ...prev!, email: e.target.value }))}
              />
            </FormControl>

            <Button
              mt={4}
              colorScheme="blue"
              type="submit"
              isLoading={loading}
            >
              Salvar Alterações
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
