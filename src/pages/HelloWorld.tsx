import { Box, Heading, Text } from '@chakra-ui/react';

export function HelloWorld() {
  console.log('HelloWorld: Renderizando página');
  
  return (
    <Box p={8}>
      <Heading mb={4}>Hello World!</Heading>
      <Text>Login realizado com sucesso!</Text>
    </Box>
  );
}
