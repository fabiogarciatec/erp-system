import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  HStack,
  Select,
  Image,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSave, FiHome, FiMapPin, FiMail, FiPhone, FiUser, FiHash } from 'react-icons/fi';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '../../components/PageHeader';
import { Link } from 'react-router-dom';
import { useCompanyData } from '../../hooks/useCompanyData';

interface State {
  id: number;
  name: string;
  uf: string;
}

interface Company {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state_id?: number;
  postal_code?: string;
  state?: {
    id: number;
    name: string;
    uf: string;
  };
}

// Funções de formatação e limpeza
const formatters = {
  // CNPJ: Formata para 00.000.000/0000-00
  cnpj: {
    format: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 18);
    },
    clean: (value: string) => value.replace(/\D/g, ''),
    mask: '00.000.000/0000-00'
  },

  // Telefone: Formata para (00) 00000-0000 ou (00) 0000-0000
  phone: {
    format: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length === 11) {
        return cleaned
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
      return cleaned
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .slice(0, 14);
    },
    clean: (value: string) => value.replace(/\D/g, ''),
    mask: '(00) 00000-0000'
  },

  // CEP: Formata para 00000-000
  cep: {
    format: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
    },
    clean: (value: string) => value.replace(/\D/g, ''),
    mask: '00000-000'
  }
};

// Hook para estilos
function useCompanyStyles() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const iconBgColor = useColorModeValue('blue.50', 'blue.900');
  const pageBg = useColorModeValue('gray.50', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const dividerColor = useColorModeValue('gray.200', 'gray.700');

  return {
    bgColor,
    borderColor,
    iconColor,
    iconBgColor,
    pageBg,
    inputBg,
    textColor,
    secondaryTextColor,
    dividerColor,
  };
}

// Interfaces para os props dos componentes
interface CardProps {
  company: Company;
  handleInputChange: (field: keyof Company, value: string) => void;
  styles: {
    bgColor: string;
    borderColor: string;
    iconColor: string;
    iconBgColor: string;
    pageBg: string;
    inputBg: string;
    textColor: string;
    secondaryTextColor: string;
    dividerColor: string;
  };
}

interface AddressCardProps extends CardProps {
  states: State[];
}

// Componentes de formulário
const BasicInfoCard = ({ company, handleInputChange, styles }: CardProps) => (
  <Card bg={styles.bgColor} borderColor={styles.borderColor} shadow="sm">
    <CardHeader>
      <HStack spacing={3}>
        <Box
          bg={styles.iconBgColor}
          p={2}
          borderRadius="md"
        >
          <FiHome size={24} color={styles.iconColor} />
        </Box>
        <Heading size="md" color={styles.textColor}>Informações Básicas</Heading>
      </HStack>
    </CardHeader>
    <Divider borderColor={styles.dividerColor} />
    <CardBody>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl isRequired>
            <FormLabel color={styles.textColor}>Nome da Empresa</FormLabel>
            <Input
              value={company.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome da empresa"
              bg={styles.inputBg}
              borderColor={styles.borderColor}
              _hover={{ borderColor: styles.iconColor }}
              _focus={{ borderColor: styles.iconColor }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isRequired>
            <FormLabel color={styles.textColor}>CNPJ</FormLabel>
            <Input
              value={company.document}
              onChange={(e) => handleInputChange('document', e.target.value)}
              placeholder="00.000.000/0000-00"
              bg={styles.inputBg}
              borderColor={styles.borderColor}
              _hover={{ borderColor: styles.iconColor }}
              _focus={{ borderColor: styles.iconColor }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel color={styles.textColor}>Telefone</FormLabel>
            <Input
              value={company.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(00) 0000-0000"
              bg={styles.inputBg}
              borderColor={styles.borderColor}
              _hover={{ borderColor: styles.iconColor }}
              _focus={{ borderColor: styles.iconColor }}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl>
            <FormLabel color={styles.textColor}>E-mail</FormLabel>
            <Input
              type="email"
              value={company.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@empresa.com"
              bg={styles.inputBg}
              borderColor={styles.borderColor}
              _hover={{ borderColor: styles.iconColor }}
              _focus={{ borderColor: styles.iconColor }}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </CardBody>
  </Card>
);

const AddressCard = ({ company, states, handleInputChange, styles }: AddressCardProps) => (
  <Card bg={styles.bgColor} borderColor={styles.borderColor} shadow="sm">
    <CardHeader>
      <Heading size="md" color={styles.textColor}>Endereço</Heading>
    </CardHeader>
    <Divider borderColor={styles.dividerColor} />
    <CardBody>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <FormControl>
          <FormLabel color={styles.textColor}>Endereço Completo</FormLabel>
          <Input
            value={company.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Rua, número, complemento"
            bg={styles.inputBg}
            borderColor={styles.borderColor}
            _hover={{ borderColor: styles.iconColor }}
            _focus={{ borderColor: styles.iconColor }}
          />
        </FormControl>

        <FormControl>
          <FormLabel color={styles.textColor}>Cidade</FormLabel>
          <Input
            placeholder="Digite a cidade"
            value={company?.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            bg={styles.inputBg}
            borderColor={styles.borderColor}
            _hover={{ borderColor: styles.iconColor }}
            _focus={{ borderColor: styles.iconColor }}
          />
        </FormControl>

        <FormControl>
          <FormLabel color={styles.textColor}>Estado</FormLabel>
          <Select
            placeholder="Selecione o estado"
            value={company?.state_id || ''}
            onChange={(e) => handleInputChange('state_id', e.target.value)}
            bg={styles.inputBg}
            borderColor={styles.borderColor}
            _hover={{ borderColor: styles.iconColor }}
            _focus={{ borderColor: styles.iconColor }}
          >
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name} ({state.uf})
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel color={styles.textColor}>CEP</FormLabel>
          <Input
            value={company.postal_code || ''}
            onChange={(e) => handleInputChange('postal_code', e.target.value)}
            placeholder="00000-000"
            bg={styles.inputBg}
            borderColor={styles.borderColor}
            _hover={{ borderColor: styles.iconColor }}
            _focus={{ borderColor: styles.iconColor }}
          />
        </FormControl>
      </SimpleGrid>
    </CardBody>
  </Card>
);

// Componente principal
function Empresa() {
  const { colorMode } = useColorMode();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mapBg = useColorModeValue('gray.50', 'gray.700');
  
  const { company, states, isLoading, handleInputChange, handleSave } = useCompanyData();
  
  // Usando import.meta.env para Vite ao invés de process.env
  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!company) return null;

  return (
    <Box w="100%" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}>
      <PageHeader 
        title="Configurações da Empresa"
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Empresa', href: '/configuracoes/empresa' }
        ]}
        rightContent={
          <Button
            leftIcon={<FiHome />}
            colorScheme="gray"
            variant="ghost"
            as={Link}
            to="/"
          >
            Início
          </Button>
        }
      />

      {/* Content */}
      <Box 
        mt="154px"  // 64px (header) + 90px (page header)
        px={6}
        bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      >
        <Box maxW="1600px" mx="auto">
          <SimpleGrid 
            columns={{ base: 1, xl: 2 }} 
            spacing={8}
            w="100%"
            mt={6}  // Espaçamento após o header
          >
            {/* Company Info Card */}
            <Card 
              bg={cardBg} 
              shadow="sm" 
              w="100%"
              overflow="hidden"
              borderColor={borderColor}
            >
              <CardHeader>
                <Stack spacing={4}>
                  <Heading size="md" color={colorMode === 'light' ? 'gray.800' : 'white'}>Informações Básicas</Heading>
                  <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    Mantenha os dados da sua empresa sempre atualizados
                  </Text>
                </Stack>
              </CardHeader>
              <Divider borderColor={borderColor} />
              <CardBody>
                <Stack spacing={6}>
                  <FormControl>
                    <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>
                      <HStack>
                        <Icon as={FiUser} color={colorMode === 'light' ? 'blue.500' : 'blue.300'} />
                        <Text>Nome da Empresa</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={company.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome da empresa"
                      bg={colorMode === 'light' ? 'white' : 'gray.700'}
                      borderColor={borderColor}
                      _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>
                      <HStack>
                        <Icon as={FiPhone} color={colorMode === 'light' ? 'blue.500' : 'blue.300'} />
                        <Text>Telefone</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={company.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 0000-0000"
                      bg={colorMode === 'light' ? 'white' : 'gray.700'}
                      borderColor={borderColor}
                      _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>
                      <HStack>
                        <Icon as={FiMail} color={colorMode === 'light' ? 'blue.500' : 'blue.300'} />
                        <Text>Email</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={company.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@empresa.com"
                      bg={colorMode === 'light' ? 'white' : 'gray.700'}
                      borderColor={borderColor}
                      _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                    />
                  </FormControl>

                  {/* Botão Salvar */}
                  <Flex justify="center" mt="auto" pt={8}>
                    <Button
                      leftIcon={<FiSave />}
                      colorScheme="blue"
                      onClick={handleSave}
                      isLoading={isLoading}
                      size="md"
                      px={8}
                      h="45px"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      Salvar Alterações
                    </Button>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>

            {/* Address Card */}
            <Card 
              bg={cardBg} 
              shadow="sm" 
              w="100%"
              overflow="hidden"
              borderColor={borderColor}
            >
              <CardHeader>
                <Stack spacing={4}>
                  <Heading size="md" color={colorMode === 'light' ? 'gray.800' : 'white'}>Localização</Heading>
                  <Text color={colorMode === 'light' ? 'gray.600' : 'gray.400'}>
                    Endereço e informações de localização
                  </Text>
                </Stack>
              </CardHeader>
              <Divider borderColor={borderColor} />
              <CardBody>
                <Stack spacing={6}>
                  <FormControl>
                    <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>
                      <HStack>
                        <Icon as={FiMapPin} color={colorMode === 'light' ? 'blue.500' : 'blue.300'} />
                        <Text>Endereço Completo</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={company.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Rua, número, complemento"
                      bg={colorMode === 'light' ? 'white' : 'gray.700'}
                      borderColor={borderColor}
                      _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>Cidade</FormLabel>
                      <Input
                        placeholder="Digite a cidade"
                        value={company?.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        borderColor={borderColor}
                        _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                        _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>Estado</FormLabel>
                      <Select
                        placeholder="Selecione o estado"
                        value={company?.state_id || ''}
                        onChange={(e) => handleInputChange('state_id', e.target.value)}
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        borderColor={borderColor}
                        _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                        _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      >
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name} ({state.uf})
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={colorMode === 'light' ? 'gray.800' : 'white'}>CEP</FormLabel>
                      <Input
                        value={company.postal_code || ''}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        placeholder="00000-000"
                        bg={colorMode === 'light' ? 'white' : 'gray.700'}
                        borderColor={borderColor}
                        _hover={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                        _focus={{ borderColor: colorMode === 'light' ? 'blue.500' : 'blue.300' }}
                      />
                    </FormControl>
                  </SimpleGrid>

                  {/* Map Preview */}
                  <Box
                    position="relative"
                    height="200px"
                    bg={mapBg}
                    borderRadius="md"
                    overflow="hidden"
                    borderColor={borderColor}
                    borderWidth="1px"
                  >
                    {mapsApiKey ? (
                      <Image
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                          `${company.address}, ${company.city}, ${states.find(s => s.id === company.state_id)?.uf}`
                        )}&zoom=15&size=800x400&key=${mapsApiKey}&style=feature:all|element:labels|visibility:on&style=feature:all|element:labels.text.fill|color:0x${colorMode === 'light' ? '000000' : 'ffffff'}`}
                        alt="Localização da empresa"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <>
                        <Image
                          src="/map-example.svg"
                          alt="Mapa de exemplo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.7
                          }}
                        />
                        <Text
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                          fontSize="sm"
                          textAlign="center"
                          bg={colorMode === 'light' ? 'whiteAlpha.800' : 'blackAlpha.600'}
                          px={4}
                          py={2}
                          borderRadius="md"
                        >
                          Mapa será exibido quando a chave do Google Maps for ativada
                        </Text>
                      </>
                    )}
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}

export default Empresa;
