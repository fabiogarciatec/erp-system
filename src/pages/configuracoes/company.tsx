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
import { FiSave, FiSearch } from 'react-icons/fi';
import { useCep } from '../../hooks/useCep';
import { useCompanyData } from '../../hooks/useCompanyData';
import { GoogleMap } from '../../components/GoogleMap';
import { Company } from '../../types/company';
import { PageHeader } from '@/components/PageHeader';
import InputMask from 'react-input-mask';

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
            <Input
              as={InputMask}
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
            <Input
              as={InputMask}
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

  if (isLoading || !company) {
    return <div>Carregando...</div>;
  }

  return (
    <Box>
      <PageHeader
        title="Configurações da Empresa"
        description="Gerencie as informações da sua empresa"
        breadcrumbs={[
          { label: 'Empresa', href: '/configuracoes/empresa' }
        ]}
      />
      <Box
        display="flex"
        gap={8}
        pt="100px"
        px={8}
        flexDirection={{ base: "column", xl: "row" }}
      >
        <VStack flex="1" spacing={6} align="stretch">
          {/* Seção: Dados da Empresa */}
          <Box borderWidth="2px" borderRadius="lg" p={6} bg={cardBg} borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              <Heading 
                size="lg" 
                bgGradient={titleGradient}
                bgClip="text"
              >
                Configurações da Empresa
              </Heading>
              <Divider borderColor={styles.dividerColor} />

              {/* Seção: Dados da Empresa */}
              <VStack spacing={4} align="stretch">
                <Heading 
                  size="md"
                  bgGradient={titleGradient}
                  bgClip="text"
                >
                  Dados da Empresa
                </Heading>

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
                      <Input
                        as={InputMask}
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
                      <Input
                        as={InputMask}
                        mask="(99) 99999-9999"
                        value={company.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </VStack>
          </Box>

          {/* Seção: Endereço */}
          <Box borderWidth="2px" borderRadius="lg" p={6} bg={cardBg} borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              <Heading 
                size="md"
                bgGradient={titleGradient}
                bgClip="text"
              >
                Endereço
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>CEP</FormLabel>
                  <HStack>
                    <InputGroup>
                      <Input
                        as={InputMask}
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

          {/* Botões de Ação */}
          <Box borderWidth="2px" borderRadius="lg" p={6} bg={cardBg} borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} justify="center">
                <Button
                  leftIcon={<FiSave />}
                  colorScheme="blue"
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  Salvar Alterações
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        {/* Container do Mapa */}
        <Box 
          display={{ base: "none", xl: "block" }}
          borderWidth="2px" 
          borderRadius="lg"
          w="900px"
          h="805px"
          position="sticky"
          top="24px"
          bg={cardBg}
          borderColor={borderColor}
          p={4}
        >
          <VStack spacing={4} align="stretch" h="full">
            <Heading 
              size="md"
              bgGradient={titleGradient}
              bgClip="text"
            >
              Localização no Mapa
            </Heading>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              Clique no mapa ou arraste o marcador para atualizar a localização
            </Text>
            {company && (
              <Box flex="1">
                <GoogleMap
                  key={`${company.address}-${company.city}-${company.state_id}-${addressUpdated}`}
                  company={company}
                  states={states}
                  latitude={company.latitude}
                  longitude={company.longitude}
                  height="100%"
                  onMapClick={async (lat, lng) => {
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
                  }}
                />
              </Box>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export { CompanyPage as Company };
