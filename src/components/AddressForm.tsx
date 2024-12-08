import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Select
} from '@chakra-ui/react';
import { useCep } from '../hooks/useCep';

export function AddressForm() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');

  const { handleCepLookup, isLoading } = useCep({
    onSuccess: (data) => {
      setEndereco(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUf(data.uf);
    }
  });

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCep(value);

    // Busca o endereço quando o CEP tiver 8 dígitos
    if (value.replace(/\D/g, '').length === 8) {
      handleCepLookup(value);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>CEP</FormLabel>
            <HStack>
              <Input
                value={cep}
                onChange={handleCepChange}
                maxLength={8}
                placeholder="Digite o CEP"
              />
              <Button
                onClick={() => {
                  if (!cep) return;
                  // Remove caracteres não numéricos antes de enviar
                  const cleanCep = cep.replace(/\D/g, '');
                  handleCepLookup(cleanCep);
                }}
                isLoading={isLoading}
                colorScheme="blue"
                size="sm"
              >
                Buscar CEP
              </Button>
            </HStack>
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl>
        <FormLabel>Endereço</FormLabel>
        <Input
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          placeholder="Endereço"
        />
      </FormControl>

      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        <GridItem colSpan={3}>
          <FormControl>
            <FormLabel>Bairro</FormLabel>
            <Input
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Bairro"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Cidade</FormLabel>
            <Input
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade"
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>UF</FormLabel>
            <Input
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              placeholder="UF"
            />
          </FormControl>
        </GridItem>
      </Grid>
    </VStack>
  );
}
