import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center" textAlign="center">
        <Heading size="2xl">401</Heading>
        <Heading size="xl">Acesso Não Autorizado</Heading>
        <Text fontSize="lg" color="gray.600">
          Você não tem permissão para acessar esta página.
        </Text>
        <Box>
          <Button
            colorScheme="blue"
            mr={4}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={logout}
          >
            Sair
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}
