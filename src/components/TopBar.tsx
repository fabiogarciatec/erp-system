import {
  Box,
  Flex,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

export function TopBar() {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      as="header"
      position="fixed"
      w="100vw"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      height="16"
      zIndex={1000}
      left={0}
      right={0}
      top={0}
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        h="full"
        px={6}
        maxW="100%"
      >
        <HStack spacing={8} alignItems="center">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={textColor}
            display={{ base: 'block', md: 'block' }}
          >
            ERP System
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}
