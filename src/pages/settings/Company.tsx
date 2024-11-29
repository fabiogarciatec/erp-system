import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useState } from 'react';

interface CompanyData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

// Dados mockados da empresa
const mockCompanyData: CompanyData = {
  razaoSocial: 'Empresa Demonstração LTDA',
  nomeFantasia: 'Demo Company',
  cnpj: '12.345.678/0001-90',
  inscricaoEstadual: '123.456.789',
  inscricaoMunicipal: '987.654.321',
  telefone: '(11) 1234-5678',
  email: 'contato@democompany.com',
  cep: '12345-678',
  endereco: 'Rua Exemplo',
  numero: '123',
  complemento: 'Sala 456',
  bairro: 'Centro',
  cidade: 'São Paulo',
  estado: 'SP',
};

export function Company() {
  const [company, setCompany] = useState<CompanyData>(mockCompanyData);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Dados salvos com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Card>
        <CardHeader>
          <Heading size="md">Dados da Empresa</Heading>
          <Text color="gray.600" mt={1}>
            Gerencie as informações da sua empresa
          </Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel>Razão Social</FormLabel>
                <Input
                  name="razaoSocial"
                  value={company.razaoSocial}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nome Fantasia</FormLabel>
                <Input
                  name="nomeFantasia"
                  value={company.nomeFantasia}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel>CNPJ</FormLabel>
                <Input
                  name="cnpj"
                  value={company.cnpj}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Inscrição Estadual</FormLabel>
                <Input
                  name="inscricaoEstadual"
                  value={company.inscricaoEstadual}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Inscrição Municipal</FormLabel>
                <Input
                  name="inscricaoMunicipal"
                  value={company.inscricaoMunicipal}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  name="telefone"
                  value={company.telefone}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>E-mail</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={company.email}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <FormControl>
                <FormLabel>CEP</FormLabel>
                <Input
                  name="cep"
                  value={company.cep}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Endereço</FormLabel>
                <Input
                  name="endereco"
                  value={company.endereco}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Número</FormLabel>
                <Input
                  name="numero"
                  value={company.numero}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <FormControl>
                <FormLabel>Complemento</FormLabel>
                <Input
                  name="complemento"
                  value={company.complemento}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Bairro</FormLabel>
                <Input
                  name="bairro"
                  value={company.bairro}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Cidade</FormLabel>
                <Input
                  name="cidade"
                  value={company.cidade}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Input
                  name="estado"
                  value={company.estado}
                  onChange={handleChange}
                />
              </FormControl>
            </SimpleGrid>

            <Box display="flex" justifyContent="flex-end" pt={4}>
              <Button colorScheme="blue" type="submit">
                Salvar Alterações
              </Button>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
