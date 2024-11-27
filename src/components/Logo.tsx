import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 165, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 165, 0, 0.7);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 165, 0, 0.5);
  }
`;

export function Logo() {
  const bgGradient = useColorModeValue(
    'linear(to-r, orange.400, yellow.400)',
    'linear(to-r, orange.200, yellow.200)'
  );
  const textColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      maxW="130px"
      px="3"
      py="1.5"
      borderRadius="md"
      bgGradient={bgGradient}
      position="relative"
      transform="translateZ(5px)"
      css={css`
        animation: ${glowAnimation} 2s infinite;
        &:hover {
          animation: none;
          box-shadow: 0 0 20px rgba(255, 165, 0, 0.7);
        }
      `}
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={textColor}
        textAlign="center"
        textShadow="1px 1px 2px rgba(0, 0, 0, 0.2)"
      >
        FATEC ERP
      </Text>
    </Box>
  );
}
