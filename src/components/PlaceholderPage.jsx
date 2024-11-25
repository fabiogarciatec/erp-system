import { Box, Heading, Text } from '@chakra-ui/react'

const PlaceholderPage = ({ title }) => {
  return (
    <Box w="full" bg="white" borderRadius="lg" shadow="sm" p={6}>
      <Heading size="lg" mb={4}>{title}</Heading>
      <Text color="gray.600">Esta página está em desenvolvimento.</Text>
    </Box>
  )
}

export default PlaceholderPage
