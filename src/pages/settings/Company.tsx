import { useEffect, useRef, useState, FormEvent, ChangeEvent, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Flex,
  Image,
  Icon,
  Center,
  Spinner,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/PageHeader';
import { FiUpload } from 'react-icons/fi';

interface FormErrors {
  name?: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  [key: string]: string | undefined;
}

interface CompanyFormData {
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  website?: string;
  foundation_date?: string;
  logo_url?: string;
}

interface CompanyData {
  id?: string;
  name?: string;
  document?: string;
  email?: string;
  phone?: string;
  website?: string;
  foundation_date?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  business_type?: string;
  industry_sector?: string;
  tax_regime?: string;
  state_registration?: string;
  municipal_registration?: string;
  legal_representative?: string;
  legal_representative_cpf?: string;
  legal_representative_phone?: string;
  legal_representative_email?: string;
  company_size?: string;
  notes?: string;
  logo_url?: string;
}

export function Company() {
  const { profile, isLoading: profileLoading } = useProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const toast = useToast();

  // Buscar dados da empresa
  const fetchCompanyData = useCallback(async () => {
    if (!profile?.company_id) {
      console.log('Perfil sem company_id:', profile);
      setLoading(false);
      return;
    }

    try {
      console.log('Tentando buscar empresa com ID:', profile.company_id);
      
      // Primeiro, vamos verificar se conseguimos acessar a tabela companies
      const { data: testData, error: testError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      console.log('Teste de acesso à tabela companies:', { testData, testError });

      // Agora vamos buscar a empresa específica
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      console.log('Resultado da busca da empresa:', {
        data,
        error,
        requestedId: profile.company_id
      });

      if (error) {
        console.error('Erro detalhado:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setError(error.message);
        if (error.code === 'PGRST301') {
          toast({
            title: 'Acesso negado',
            description: 'Você não tem permissão para acessar os dados desta empresa.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Erro ao carregar dados',
            description: `Erro: ${error.message}`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
        return;
      }

      if (data) {
        console.log('Dados da empresa encontrados:', data);
        setCompany({
          ...data,
          foundation_date: data.foundation_date ? data.foundation_date.split('T')[0] : '',
        });
        setError(null);
      } else {
        console.log('Nenhum dado encontrado para o ID:', profile.company_id);
        setError('Empresa não encontrada');
        toast({
          title: 'Empresa não encontrada',
          description: 'Não foi possível encontrar os dados da empresa.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Erro não tratado:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [profile?.company_id, toast]);

  // Validar campos
  const validateForm = (data: Partial<CompanyData>): boolean => {
    const errors: FormErrors = {};

    if (!data.name?.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!data.document?.trim()) {
      errors.document = 'CNPJ é obrigatório';
    } else if (!/^\d{14}$/.test(data.document.replace(/\D/g, ''))) {
      errors.document = 'CNPJ inválido';
    }

    if (!data.email?.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    if (!data.phone?.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(data.phone.replace(/\D/g, ''))) {
      errors.phone = 'Telefone inválido';
    }

    if (!data.address?.trim()) {
      errors.address = 'Endereço é obrigatório';
    }

    if (!data.city?.trim()) {
      errors.city = 'Cidade é obrigatória';
    }

    if (!data.state?.trim()) {
      errors.state = 'Estado é obrigatório';
    } else if (!/^[A-Z]{2}$/.test(data.state.toUpperCase())) {
      errors.state = 'Estado inválido (use UF)';
    }

    if (!data.zip_code?.trim()) {
      errors.zip_code = 'CEP é obrigatório';
    } else if (!/^\d{8}$/.test(data.zip_code.replace(/\D/g, ''))) {
      errors.zip_code = 'CEP inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Atualizar empresa
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company || !profile?.company_id) return;

    // Validar campos obrigatórios
    const requiredFields: CompanyFormData = {
      name: company.name || '',
      document: company.document || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      zip_code: company.zip_code || '',
      website: company.website,
      foundation_date: company.foundation_date,
      logo_url: company.logo_url,
    };

    if (!validateForm(requiredFields)) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, corrija os campos destacados.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setSaving(true);

      const updateData: Record<string, string | undefined> = {
        ...company,
        updated_at: new Date().toISOString(),
      };

      // Remover campos undefined ou null
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const { error: updateError } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', profile.company_id);

      if (updateError) throw updateError;

      toast({
        title: 'Sucesso',
        description: 'Dados da empresa atualizados com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      await fetchCompanyData();
    } catch (error: any) {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Criar empresa
  const createCompany = async (data: Partial<CompanyData>) => {
    if (!profile?.id) return;

    try {
      setSaving(true);

      const { data: newCompany, error: createError } = await supabase
        .from('companies')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Atualizar o perfil do usuário com o company_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ company_id: newCompany.id })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast({
        title: 'Sucesso',
        description: 'Empresa criada com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Recarregar a página para atualizar os dados
      window.location.reload();
    } catch (error: any) {
      toast({
        title: 'Erro ao criar empresa',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Atualizar campo do formulário
  const handleInputChange = (field: keyof CompanyData, value: string) => {
    if (!company) return;
    setCompany({ ...company, [field]: value });
  };

  // Upload de logo
  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !company?.id) return;

    try {
      setUploadingLogo(true);

      // Validações
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione uma imagem válida (JPG, PNG)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Gerar nome do arquivo
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `logo_${company.id}_${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('company_logos')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Atualizar empresa
      const { error: updateError } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', company.id);

      if (updateError) {
        // Se falhar ao atualizar a empresa, remover a imagem do storage
        await supabase.storage
          .from('company_logos')
          .remove([fileName]);
        throw new Error(`Erro ao atualizar empresa: ${updateError.message}`);
      }

      // Remover logo antiga se existir
      if (company.logo_url) {
        const oldFileName = company.logo_url.split('/').pop();
        if (oldFileName && oldFileName !== fileName) {
          await supabase.storage
            .from('company_logos')
            .remove([oldFileName])
            .then(({ error }) => {
              if (error) {
                console.warn('Erro ao remover logo antiga:', error);
              }
            });
        }
      }

      // Atualizar estado local
      setCompany(prev => prev ? { ...prev, logo_url: publicUrl } : null);

      toast({
        title: 'Sucesso!',
        description: 'Logo atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      toast({
        title: 'Erro no upload',
        description: error instanceof Error ? error.message : 'Erro ao fazer upload da logo',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (!profileLoading && profile && mounted) {
          await fetchCompanyData();
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [profile, profileLoading, fetchCompanyData]);

  if (loading || profileLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <PageHeader
          title="Configurações da Empresa"
          subtitle="Ocorreu um erro ao carregar os dados"
        />
        <Box bg="red.50" p={4} rounded="md" mb={4}>
          <Text color="red.600">{error}</Text>
        </Box>
      </Container>
    );
  }

  // Se não houver empresa associada, mostrar formulário de criação
  if (!profile?.company_id && !loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <PageHeader
          title="Configurações da Empresa"
          subtitle="Crie sua empresa para começar"
        />
        <Box bg="white" p={8} rounded="lg" shadow="sm">
          <VStack spacing={6} align="stretch">
            <Text>
              Você ainda não possui uma empresa cadastrada. Preencha os dados abaixo para criar sua empresa.
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel>Nome da Empresa</FormLabel>
                <Input
                  placeholder="Nome da sua empresa"
                  onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value } as CompanyData))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>CNPJ</FormLabel>
                <Input
                  placeholder="00.000.000/0000-00"
                  onChange={(e) => setCompany(prev => ({ ...prev, document: e.target.value } as CompanyData))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  placeholder="email@empresa.com"
                  onChange={(e) => setCompany(prev => ({ ...prev, email: e.target.value } as CompanyData))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Telefone</FormLabel>
                <Input
                  placeholder="(00) 0000-0000"
                  onChange={(e) => setCompany(prev => ({ ...prev, phone: e.target.value } as CompanyData))}
                />
              </FormControl>
            </SimpleGrid>
            <Button
              colorScheme="blue"
              isLoading={saving}
              onClick={() => company && createCompany(company)}
              size="lg"
              width="full"
              mt={4}
            >
              Criar Empresa
            </Button>
          </VStack>
        </Box>
      </Container>
    );
  }

  if (!profile?.company_id) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Você não está associado a nenhuma empresa.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <PageHeader
        title="Configurações da Empresa"
        subtitle="Gerencie as informações da sua empresa"
      />
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={8}>
          {/* Card de Logo */}
          <Box bg="white" p={4} rounded="lg" shadow="sm">
            <Heading size="md" mb={4} color="blue.600">
              Logo da Empresa
            </Heading>
            <Box pl={1}>
              <Flex gap={6} align="start">
                {company?.logo_url ? (
                  <Box position="relative" w="120px" h="120px">
                    <Image
                      src={company.logo_url}
                      alt="Logo da empresa"
                      objectFit="contain"
                      w="100%"
                      h="100%"
                      rounded="lg"
                    />
                  </Box>
                ) : (
                  <Box
                    w="120px"
                    h="120px"
                    border="2px dashed"
                    borderColor="gray.200"
                    rounded="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiUpload} w={6} h={6} color="gray.400" />
                  </Box>
                )}
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.500">
                    Formatos aceitos: JPG, PNG
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Tamanho máximo: 5MB
                  </Text>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={uploadingLogo}
                    loadingText="Enviando..."
                    colorScheme="blue"
                    leftIcon={<Icon as={FiUpload} />}
                    size="sm"
                    mt={1}
                  >
                    {company?.logo_url ? 'Alterar Logo' : 'Upload Logo'}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                </VStack>
              </Flex>
            </Box>
          </Box>

          {/* Card de Informações Básicas */}
          <Box bg="white" p={6} rounded="lg" shadow="sm">
            <Heading size="md" mb={6} color="blue.600">
              Informações Básicas
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!formErrors.name}>
                <FormLabel>Nome da Empresa</FormLabel>
                <Input
                  value={company?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome da empresa"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.document}>
                <FormLabel>CNPJ</FormLabel>
                <Input
                  value={company?.document || ''}
                  onChange={(e) => handleInputChange('document', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.document}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.email}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  value={company?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@empresa.com"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.phone}>
                <FormLabel>Telefone</FormLabel>
                <Input
                  value={company?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(00) 0000-0000"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  value={company?.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.empresa.com.br"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Data de Fundação</FormLabel>
                <Input
                  type="date"
                  value={company?.foundation_date || ''}
                  onChange={(e) => handleInputChange('foundation_date', e.target.value)}
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Card de Endereço */}
          <Box bg="white" p={6} rounded="lg" shadow="sm">
            <Heading size="md" mb={6} color="blue.600">
              Endereço
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!formErrors.address}>
                <FormLabel>Endereço</FormLabel>
                <Input
                  value={company?.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, Avenida, etc"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.address}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Número</FormLabel>
                <Input
                  value={company?.address_number || ''}
                  onChange={(e) => handleInputChange('address_number', e.target.value)}
                  placeholder="123"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Complemento</FormLabel>
                <Input
                  value={company?.address_complement || ''}
                  onChange={(e) => handleInputChange('address_complement', e.target.value)}
                  placeholder="Sala, Andar, etc"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Bairro</FormLabel>
                <Input
                  value={company?.neighborhood || ''}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.city}>
                <FormLabel>Cidade</FormLabel>
                <Input
                  value={company?.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.city}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.state}>
                <FormLabel>Estado</FormLabel>
                <Input
                  value={company?.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="UF"
                  maxLength={2}
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.state}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!formErrors.zip_code}>
                <FormLabel>CEP</FormLabel>
                <Input
                  value={company?.zip_code || ''}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  placeholder="00000-000"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
                <FormErrorMessage>{formErrors.zip_code}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Card de Informações Fiscais */}
          <Box bg="white" p={6} rounded="lg" shadow="sm">
            <Heading size="md" mb={6} color="blue.600">
              Informações Fiscais
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Tipo de Empresa</FormLabel>
                <Input
                  value={company?.business_type || ''}
                  onChange={(e) => handleInputChange('business_type', e.target.value)}
                  placeholder="Ex: LTDA, MEI, etc"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Setor de Atuação</FormLabel>
                <Input
                  value={company?.industry_sector || ''}
                  onChange={(e) => handleInputChange('industry_sector', e.target.value)}
                  placeholder="Ex: Tecnologia, Varejo, etc"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Regime Tributário</FormLabel>
                <Input
                  value={company?.tax_regime || ''}
                  onChange={(e) => handleInputChange('tax_regime', e.target.value)}
                  placeholder="Ex: Simples Nacional, Lucro Real"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Inscrição Estadual</FormLabel>
                <Input
                  value={company?.state_registration || ''}
                  onChange={(e) => handleInputChange('state_registration', e.target.value)}
                  placeholder="Número da Inscrição Estadual"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Inscrição Municipal</FormLabel>
                <Input
                  value={company?.municipal_registration || ''}
                  onChange={(e) => handleInputChange('municipal_registration', e.target.value)}
                  placeholder="Número da Inscrição Municipal"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Card de Representante Legal */}
          <Box bg="white" p={6} rounded="lg" shadow="sm">
            <Heading size="md" mb={6} color="blue.600">
              Representante Legal
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Nome do Representante</FormLabel>
                <Input
                  value={company?.legal_representative || ''}
                  onChange={(e) => handleInputChange('legal_representative', e.target.value)}
                  placeholder="Nome completo"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>CPF do Representante</FormLabel>
                <Input
                  value={company?.legal_representative_cpf || ''}
                  onChange={(e) => handleInputChange('legal_representative_cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Telefone do Representante</FormLabel>
                <Input
                  value={company?.legal_representative_phone || ''}
                  onChange={(e) => handleInputChange('legal_representative_phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email do Representante</FormLabel>
                <Input
                  value={company?.legal_representative_email || ''}
                  onChange={(e) => handleInputChange('legal_representative_email', e.target.value)}
                  placeholder="email@representante.com"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Botões de Ação */}
          <Flex justify="flex-end" gap={4}>
            <Button
              type="reset"
              variant="outline"
              onClick={() => fetchCompanyData()}
              isDisabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={saving}
              loadingText="Salvando..."
            >
              Salvar Alterações
            </Button>
          </Flex>
        </Stack>
      </form>
    </Container>
  );
}
