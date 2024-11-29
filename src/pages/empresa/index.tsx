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
} from '@chakra-ui/react';
import { useState } from 'react';

// Dados mockados da empresa
const mockEmpresa = {
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

export default function Empresa() {
  const [empresa, setEmpresa] = useState(mockEmpresa);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto apenas mostra um toast de sucesso
    toast({
      title: 'Dados salvos com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresa(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
                  <FormLabel>Razão Social</FormLabel>
                  <Input
                    name="razaoSocial"
                    value={empresa.razaoSocial}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl isRequired>
                  <FormLabel>CNPJ</FormLabel>
                  <Input
                    name="cnpj"
                    value={empresa.cnpj}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <Input
                    name="nomeFantasia"
                    value={empresa.nomeFantasia}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 3 }}>
                <FormControl>
                  <FormLabel>Inscrição Estadual</FormLabel>
                  <Input
                    name="inscricaoEstadual"
                    value={empresa.inscricaoEstadual}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 3 }}>
                <FormControl>
                  <FormLabel>Inscrição Municipal</FormLabel>
                  <Input
                    name="inscricaoMunicipal"
                    value={empresa.inscricaoMunicipal}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    name="telefone"
                    value={empresa.telefone}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 8 }}>
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={empresa.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 3 }}>
                <FormControl>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    name="cep"
                    value={empresa.cep}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <FormLabel>Endereço</FormLabel>
                  <Input
                    name="endereco"
                    value={empresa.endereco}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 3 }}>
                <FormControl>
                  <FormLabel>Número</FormLabel>
                  <Input
                    name="numero"
                    value={empresa.numero}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Complemento</FormLabel>
                  <Input
                    name="complemento"
                    value={empresa.complemento}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    name="bairro"
                    value={empresa.bairro}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 3 }}>
                <FormControl>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    name="cidade"
                    value={empresa.cidade}
                    onChange={handleChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 1 }}>
                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Input
                    name="estado"
                    value={empresa.estado}
                    onChange={handleChange}
                  />
                </FormControl>
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
