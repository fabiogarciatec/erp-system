import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Image,
  Text,
  Flex,
  useColorModeValue,
  Heading,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useProfile } from '../../hooks/useProfile';
import { FiMail, FiPhone, FiGlobe, FiBriefcase, FiMapPin } from 'react-icons/fi';
import InputMask from 'react-input-mask';

interface CompanyData {
  id: string;
  name: string;
  logo_url: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  tax_id: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function Company() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const toast = useToast();
  const { profile } = useProfile();
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    fetchCompanyData();
  }, [profile]);

  const fetchCompanyData = async () => {
    try {
      if (!profile?.company_id) return;

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast({
        title: 'Erro ao carregar dados da empresa',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!company?.name?.trim()) {
      newErrors.name = 'Nome da empresa é obrigatório';
    }

    if (!company?.tax_id?.trim()) {
      newErrors.tax_id = 'CNPJ é obrigatório';
    } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(company.tax_id)) {
      newErrors.tax_id = 'CNPJ inválido';
    }

    if (company?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (company?.website && !/^https?:\/\/.*/.test(company.website)) {
      newErrors.website = 'Website deve começar com http:// ou https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar tipo e tamanho do arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione uma imagem (JPG, PNG ou GIF)',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 5MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile?.company_id}/logo.${fileExt}`;

      // Upload logo to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Update company record with new logo URL
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', profile?.company_id);

      if (updateError) throw updateError;

      setCompany(prev => prev ? { ...prev, logo_url: publicUrl } : null);
      toast({
        title: 'Logo atualizada com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating logo:', error);
      toast({
        title: 'Erro ao atualizar logo',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !profile?.company_id) return;

    if (!validateForm()) {
      toast({
        title: 'Formulário inválido',
        description: 'Por favor, corrija os erros antes de salvar',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('companies')
        .update({
          name: company.name,
          address: company.address,
          phone: company.phone,
          email: company.email,
          website: company.website,
          tax_id: company.tax_id,
        })
        .eq('id', profile.company_id);

      if (error) throw error;

      toast({
        title: 'Dados atualizados com sucesso',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: 'Erro ao atualizar dados',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => prev ? { ...prev, [name]: value } : null);
    // Limpa o erro do campo quando ele é modificado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!company) {
    return (
      <Box p={4}>
        <Text>Carregando dados da empresa...</Text>
      </Box>
    );
  }

  return (
    <Box w="full" p={4}>
      <Heading size="lg" mb={6}>Configurações da Empresa</Heading>
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        {/* Logo Section */}
        <Box textAlign="center" w="full">
          <FormLabel>Logo da Empresa</FormLabel>
          <Flex direction="column" align="center" mb={4}>
            <Box
              borderWidth={2}
              borderStyle="dashed"
              borderColor="gray.300"
              borderRadius="lg"
              p={4}
              mb={4}
              w="200px"
              h="200px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={company.logo_url || '/placeholder-logo.png'}
                alt="Logo da empresa"
                maxH="100%"
                maxW="100%"
                objectFit="contain"
              />
            </Box>
            <FormControl>
              <Button
                as="label"
                htmlFor="logo-upload"
                colorScheme="blue"
                cursor="pointer"
                isLoading={isLoading}
              >
                Alterar Logo
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  display="none"
                />
              </Button>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Formatos aceitos: JPG, PNG e GIF (máx. 5MB)
              </Text>
            </FormControl>
          </Flex>
        </Box>

        {/* Company Information */}
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel>Nome da Empresa</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiBriefcase color="gray.300" />
            </InputLeftElement>
            <Input
              name="name"
              value={company.name}
              onChange={handleChange}
              placeholder="Nome da empresa"
            />
          </InputGroup>
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.tax_id} isRequired>
          <FormLabel>CNPJ</FormLabel>
          <Input
            as={InputMask}
            mask="99.999.999/9999-99"
            name="tax_id"
            value={company.tax_id}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
          />
          <FormErrorMessage>{errors.tax_id}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Endereço</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiMapPin color="gray.300" />
            </InputLeftElement>
            <Input
              name="address"
              value={company.address}
              onChange={handleChange}
              placeholder="Endereço completo"
            />
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Telefone</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiPhone color="gray.300" />
            </InputLeftElement>
            <Input
              as={InputMask}
              mask="(99) 99999-9999"
              name="phone"
              value={company.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </InputGroup>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>E-mail</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiMail color="gray.300" />
            </InputLeftElement>
            <Input
              name="email"
              type="email"
              value={company.email}
              onChange={handleChange}
              placeholder="email@empresa.com"
            />
          </InputGroup>
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.website}>
          <FormLabel>Website</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiGlobe color="gray.300" />
            </InputLeftElement>
            <Input
              name="website"
              value={company.website}
              onChange={handleChange}
              placeholder="https://www.empresa.com"
            />
          </InputGroup>
          <FormErrorMessage>{errors.website}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          w="full"
          isLoading={isLoading}
          loadingText="Salvando..."
        >
          Salvar Alterações
        </Button>
      </VStack>
    </Box>
  );
}
