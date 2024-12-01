import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Stack,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GoogleMap } from '../../components/GoogleMap';
import { useCompanyData } from '../../hooks/useCompanyData';
import { useCep } from '../../hooks/useCep';
import { Company } from '@/types/company';

interface CompanyForm {
  name: string;
  email: string;
  phone: string;
  postal_code: string;
  address: string;
  city: string;
  state: string;
}

export default function Empresa() {
  const toast = useToast();
  const { company, isLoading: isLoadingCompany, handleInputChange, handleSave } = useCompanyData();
  const { handleCepLookup: fetchAddressFromCep, isLoading: isLoadingCep } = useCep();
  const [formData, setFormData] = useState<CompanyForm>({
    name: '',
    email: '',
    phone: '',
    postal_code: '',
    address: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        postal_code: company.postal_code || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state_id?.toString() || '',
      });
    }
  }, [company]);

  const handlePostalCodeChange = async (value: string) => {
    try {
      // Remove caracteres não numéricos
      const numericValue = value.replace(/\D/g, '');
      
      // Aplica a máscara XX.XXX-XXX
      let maskedValue = numericValue;
      if (numericValue.length > 0) {
        maskedValue = numericValue.replace(/^(\d{2})(\d{3})(\d{3}).*/, (_, p1, p2, p3) => {
          if (p3) return `${p1}.${p2}-${p3}`;
          if (p2) return `${p1}.${p2}`;
          return p1;
        });
      }
      
      // Atualiza o form com o valor mascarado
      setFormData(prev => ({ ...prev, postal_code: maskedValue }));
      
      // Se tiver 8 dígitos, busca o endereço
      if (numericValue.length === 8) {
        const address = await fetchAddressFromCep(numericValue);
        
        if (address) {
          // Atualiza o formData
          setFormData(prev => ({
            ...prev,
            postal_code: maskedValue,
            address: address.logradouro || '',
            city: address.localidade || '',
            state: address.uf || '',
          }));

          // Atualiza o banco de dados
          await Promise.all([
            handleInputChange('postal_code', numericValue),
            handleInputChange('address', address.logradouro || ''),
            handleInputChange('city', address.localidade || ''),
            handleInputChange('state_id', address.uf || '')
          ]);

          toast({
            title: 'Endereço atualizado',
            description: 'O endereço foi atualizado com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      toast({
        title: 'Erro!',
        description: 'Erro ao atualizar o endereço.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'postal_code') {
      await handlePostalCodeChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      await handleInputChange(name as keyof Company, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSave();
      toast({
        title: 'Sucesso!',
        description: 'Dados salvos com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro!',
        description: 'Erro ao salvar os dados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoadingCompany) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Card>
        <CardHeader>
          <Heading size="md">Dados da Empresa</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 8 }}>
                <FormControl isRequired>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    isDisabled={isLoadingCep}
                    placeholder="00.000-000"
                    maxLength={10}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 8 }}>
                <FormControl>
                  <FormLabel>Endereço</FormLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={12}>
                <Box h="400px">
                  {company && (
                    <GoogleMap
                      company={company}
                      states={[]}
                      latitude={-23.550520}
                      longitude={-46.633308}
                    />
                  )}
                </Box>
              </GridItem>
            </Grid>
            <Box display="flex" justifyContent="flex-end" pt={4}>
              <Button colorScheme="blue" type="submit">
                Salvar
              </Button>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
