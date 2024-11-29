import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';

export function TopBar() {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Box
      as="header"
      position="fixed"
      w="full"
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom="1px"
      borderColor={borderColor}
      height="16"
      zIndex={2}
      left={0}
      right={0}
      top={0}
    >
      <Container maxW="full" h="full">
        <Flex alignItems="center" justifyContent="space-between" h="full" px={4}>
          <HStack spacing={8} alignItems="center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={textColor}
              display={{ base: 'none', md: 'block' }}
            >
              ERP System
            </Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
