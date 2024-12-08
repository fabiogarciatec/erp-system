import { Box, Text, Container } from '@chakra-ui/react';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Container maxW="container.xl" py={8}>
      <Box 
        p={8} 
        bg="white" 
        borderRadius="lg" 
        boxShadow="sm"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {title}
        </Text>
        <Text color="gray.600">
          Esta página está em desenvolvimento.
        </Text>
      </Box>
    </Container>
  );
}
