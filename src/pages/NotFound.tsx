import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center" textAlign="center">
        <Heading size="2xl">404</Heading>
        <Heading size="xl">Página Não Encontrada</Heading>
        <Text fontSize="lg" color="gray.600">
          A página que você está procurando não existe.
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate('/')}
        >
          Voltar para o início
        </Button>
      </VStack>
    </Container>
  );
}
