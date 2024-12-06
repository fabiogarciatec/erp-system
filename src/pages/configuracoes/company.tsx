import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Heading,
  Divider,
  Grid,
  GridItem,
  SimpleGrid,
  Icon,
  Flex,
  Stack,
  InputGroup,
} from '@chakra-ui/react';
import { FiSave, FiSearch, FiGrid } from 'react-icons/fi';
import { useCep } from '../../hooks/useCep';
import { useCompanyData } from '../../hooks/useCompanyData';
import { GoogleMap } from '../../components/GoogleMap';
import { Company } from '../../types/company';
import { PageHeader } from '@/components/PageHeader';
import { InputMaskChakra } from '@/components/InputMaskChakra';

interface StyleProps {
  textColor: string;
  dividerColor: string;
  iconColor: string;
}

interface CompanyCardProps {
  company: Company;
  handleInputChange: (field: keyof Company, value: any) => void;
  styles: StyleProps;
}

function CompanyCard({ company, handleInputChange, styles }: CompanyCardProps) {
  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
      <GridItem colSpan={{ base: 1, md: 2 }}>
        <FormControl isRequired>
          <FormLabel>Nome da Empresa</FormLabel>
          <Input
            value={company.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Nome da empresa"
          />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl isRequired>
          <FormLabel>CNPJ</FormLabel>
          <InputGroup>
            <InputMaskChakra
              mask="99.999.999/9999-99"
              value={company.document}
              onChange={(e) => handleInputChange('document', e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </InputGroup>
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Telefone</FormLabel>
          <InputGroup>
            <InputMaskChakra
              mask="(99) 99999-9999"
              value={company.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </InputGroup>
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            value={company.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="email@empresa.com"
          />
        </FormControl>
      </GridItem>
    </Grid>
  );
}

interface AddressCardProps {
  company: Company;
  states: Array<{ id: number; uf: string; name: string }>;
  handleInputChange: (field: keyof Company, value: any) => void;
  styles: StyleProps;
}

function AddressCard({ company, states, handleInputChange, styles }: AddressCardProps) {
  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
      <GridItem colSpan={{ base: 1, md: 2 }}>
        <FormControl>
          <FormLabel>Logradouro</FormLabel>
          <Input
            value={company.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Rua, Avenida, etc"
          />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Número</FormLabel>
          <Input
            value={company.address_number}
            onChange={(e) => handleInputChange('address_number', e.target.value)}
            placeholder="123"
          />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Complemento</FormLabel>
          <Input
            value={company.address_complement || ''}
            onChange={(e) => handleInputChange('address_complement', e.target.value)}
            placeholder="Apto, Sala, etc"
          />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Bairro</FormLabel>
          <Input
            value={company.neighborhood}
            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            placeholder="Bairro"
          />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Cidade</FormLabel>
          <Input
            value={company.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Cidade"
          />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl>
          <FormLabel>Estado</FormLabel>
          <Select
            value={company.state_id?.toString()}
            onChange={(e) => handleInputChange('state_id', parseInt(e.target.value))}
          >
            <option value="">Selecione um estado</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </GridItem>
    </Grid>
  );
}

function CompanyPage() {
  const { company, states, isLoading, handleInputChange: baseHandleInputChange, handleSave, fetchCompanyData, isSaving } = useCompanyData();
  const toast = useToast();
  const [addressUpdated, setAddressUpdated] = useState(false);

  const { handleCepLookup, isLoading: cepLoading } = useCep({
    onSuccess: async (data) => {
      try {
        // Limpa as coordenadas existentes para forçar nova geocodificação
        await handleInputChange('latitude', 0);
        await handleInputChange('longitude', 0);

        // Atualiza os campos no banco de dados
        const updates = [
          handleInputChange('address', data.logradouro || ''),
          handleInputChange('neighborhood', data.bairro || ''),
          handleInputChange('city', data.localidade || ''),
          handleInputChange('postal_code', data.cep?.replace(/\D/g, '') || ''),
          handleInputChange('address_complement', data.complemento || '')
        ];

        // Encontra o ID do estado baseado na UF
        const state = states.find(state => state.uf.toLowerCase() === data.uf.toLowerCase());
        if (state) {
          updates.push(handleInputChange('state_id', state.id));
        }

        // Aguarda todas as atualizações terminarem
        await Promise.all(updates);

        // Marca que o endereço foi atualizado
        setAddressUpdated(true);

        // Recarrega os dados do banco
        await fetchCompanyData();

        toast({
          title: "Sucesso",
          description: "Endereço atualizado com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar endereço",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao buscar endereço",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  // Função para remover máscaras
  const removeMask = (value: string) => value.replace(/\D/g, '');

  // Wrapper para handleInputChange que remove máscaras quando necessário
  const handleInputChange = (field: keyof Company, value: any) => {
    if (field === 'phone' || field === 'document' || field === 'postal_code') {
      baseHandleInputChange(field, removeMask(value));
    } else {
      baseHandleInputChange(field, value);
    }
  };

  const styles: StyleProps = {
    textColor: useColorModeValue('gray.800', 'white'),
    dividerColor: useColorModeValue('gray.200', 'gray.600'),
    iconColor: useColorModeValue('gray.600', 'gray.400'),
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const titleGradient = useColorModeValue(
    'linear(to-r, blue.400, blue.600)',
    'linear(to-r, blue.200, blue.400)'
  );

  const handleCepChange = (value: string) => {
    // Apenas atualiza o campo com o valor digitado
    handleInputChange('postal_code', value);
  };

  // Reset addressUpdated quando as coordenadas forem atualizadas
  useEffect(() => {
    if (addressUpdated && company?.latitude && company?.longitude) {
      setAddressUpdated(false);
    }
  }, [company?.latitude, company?.longitude]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    try {
      await handleInputChange('latitude', lat);
      await handleInputChange('longitude', lng);
      toast({
        title: "Localização atualizada",
        description: "As coordenadas foram atualizadas com sucesso.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar as coordenadas.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading || !company) {
    return <div>Carregando...</div>;
  }

  return (
    <Box>
      <PageHeader
        title="Empresa"
        icon={FiGrid}
        subtitle="Gerencie as informações da sua empresa"
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Empresa', href: '/configuracoes/empresa' }
        ]}
      />

      <Box
        display="flex"
        flexDirection={{ base: "column", xl: "row" }}
        gap={4}
        px={{ base: 2, xl: 8 }}
        pb={12}
        mx={{ base: 0, xl: "auto" }}
        maxW={{ base: "100%", xl: "86vw" }}
        w="full"
      >
        {/* Coluna da esquerda - Formulários */}
        <Box flex={{ base: "1", xl: "1.5" }}>
          <VStack spacing={6} w="full" align="stretch">
            {/* Bloco: Informações da Empresa */}
            <Box 
              borderWidth="2px" 
              borderRadius={{ base: "md", md: "lg" }}
              p={{ base: 3, md: 6 }}
              bg={cardBg} 
              borderColor={borderColor}
              w="full"
              mx={{ base: 0, xl: "auto" }}
            >
              <VStack spacing={4} align="stretch">
                <Heading 
                  size="md"
                  bgGradient={titleGradient}
                  bgClip="text"
                >
                  Configurações da Empresa
                </Heading>
                <Divider borderColor={styles.dividerColor} />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <Input
                      value={company.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>CNPJ</FormLabel>
                    <InputGroup>
                      <InputMaskChakra
                        mask="99.999.999/9999-99"
                        value={company.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        placeholder="00.000.000/0000-00"
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>E-mail</FormLabel>
                    <Input
                      value={company.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@empresa.com"
                      type="email"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Telefone</FormLabel>
                    <InputGroup>
                      <InputMaskChakra
                        mask="(99) 99999-9999"
                        value={company.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Bloco: Endereço */}
            <Box 
              borderWidth="2px" 
              borderRadius={{ base: "md", md: "lg" }}
              p={{ base: 3, md: 6 }}
              bg={cardBg} 
              borderColor={borderColor}
              w="full"
              mx={{ base: 0, xl: "auto" }}
            >
              <VStack spacing={4} align="stretch">
                <Heading 
                  size="md"
                  bgGradient={titleGradient}
                  bgClip="text"
                >
                  Endereço
                </Heading>
                <Divider borderColor={styles.dividerColor} />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>CEP</FormLabel>
                    <HStack>
                      <InputGroup>
                        <InputMaskChakra
                          mask="99999-999"
                          value={company.postal_code}
                          onChange={(e) => handleInputChange('postal_code', e.target.value)}
                          placeholder="00000-000"
                        />
                      </InputGroup>
                      <Button
                        onClick={() => {
                          if (!company.postal_code) return;
                          handleCepLookup(company.postal_code);
                        }}
                        isLoading={cepLoading}
                        colorScheme="blue"
                        leftIcon={<Icon as={FiSearch} />}
                      >
                        Buscar
                      </Button>
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Endereço</FormLabel>
                    <Input
                      value={company.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Rua, Avenida, etc"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Número</FormLabel>
                    <Input
                      value={company.address_number}
                      onChange={(e) => handleInputChange('address_number', e.target.value)}
                      placeholder="Nº"
                    />
                  </FormControl>

                  <GridItem colSpan={2}>
                    <FormControl>
                      <FormLabel>Complemento</FormLabel>
                      <Input
                        value={company.address_complement || ''}
                        onChange={(e) => handleInputChange('address_complement', e.target.value)}
                        placeholder="Apto, Sala, etc"
                      />
                    </FormControl>
                  </GridItem>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Bairro</FormLabel>
                    <Input
                      value={company.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Bairro"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Cidade</FormLabel>
                    <Input
                      value={company.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Cidade"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      value={company.state_id || ''}
                      onChange={(e) => handleInputChange('state_id', Number(e.target.value))}
                      placeholder="Selecione o estado"
                    >
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Coluna da direita - Mapa */}
        <Box 
          flex={{ base: "1", xl: "1" }} 
          w="full"
          position="relative"
          minH={{ base: "400px", xl: "auto" }}
          h={{ base: "400px", xl: "auto" }}
        >
          <Box
            borderWidth="2px"
            borderRadius="lg"
            bg={cardBg}
            borderColor={borderColor}
            position={{ base: "relative", xl: "sticky" }}
            top={{ base: 0, xl: "100px" }}
            h="full"
            overflow="hidden"
            p={{ base: 2, xl: 3 }}
          >
            <VStack spacing={4} align="stretch" h="full">
              <Heading 
                size="md"
                bgGradient={titleGradient}
                bgClip="text"
              >
                Localização
              </Heading>
              <Divider borderColor={styles.dividerColor} />
              <Box 
                flex="1" 
                borderRadius="md" 
                overflow="hidden" 
                position="relative"
                minH={{ base: "300px", xl: "auto" }}
              >
                <GoogleMap
                  address={`${company.address}, ${company.city}, ${states.find(s => s.id === company.state_id)?.uf}`}
                  latitude={company.latitude}
                  longitude={company.longitude}
                  onLocationSelect={handleLocationSelect}
                  height="100%"
                  company={company}
                  states={states}
                />
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* Botões de Ação */}
      <Flex
        width="100%"
        justify="center"
        mt={-6}
        mb={4}
      >
        <Box 
          borderWidth="2px" 
          borderRadius="lg" 
          p={{ base: 2, xl: 3 }}
          ml={{ base: 2, xl: 6 }}
          mr={{ base: 2, xl: 6 }}
          bg={cardBg} 
          borderColor={borderColor} 
          maxW="86vw"
          w="full"
          position="relative"
        >
          <VStack spacing={3} align="stretch">
            <HStack spacing={3} justify="center">
              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isSaving}
                size="lg"
                px={4}
              >
                Salvar Alterações
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export { CompanyPage as Company };
