import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdLock, MdArrowBack } from 'react-icons/md';

export default function AcessoNegado() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleVoltar = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <Container maxW="container.md" py={20}>
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        p={8}
        rounded="xl"
        shadow="lg"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Icon
            as={MdLock}
            boxSize={16}
            color="red.500"
          />
          
          <Heading size="xl" color="red.500">
            Acesso Negado
          </Heading>
          
          <Text fontSize="lg" color={textColor}>
            Desculpe, você não tem permissão para acessar esta página.
          </Text>
          
          <Text fontSize="md" color={textColor}>
            Por favor, entre em contato com o administrador do sistema se você
            acredita que deveria ter acesso a esta área.
          </Text>

          <Button
            leftIcon={<Icon as={MdArrowBack} />}
            colorScheme="blue"
            size="lg"
            onClick={handleVoltar}
            mt={4}
          >
            Voltar
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
