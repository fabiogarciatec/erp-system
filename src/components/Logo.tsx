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

const Logo = () => {
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
      transition="all 0.2s ease"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'md',
        background: 'white',
        opacity: 0.2,
        filter: 'blur(4px)',
        transform: 'translateZ(-1px)',
      }}
      css={css`
        animation: ${glowAnimation} 3s infinite;
      `}
      _hover={{
        transform: 'translateZ(8px) scale(1.01)',
      }}
    >
      <Text
        fontSize="17px"
        fontWeight="bold"
        textAlign="center"
        color={textColor}
        lineHeight="1.2"
        textShadow="0 1px 1px rgba(0,0,0,0.1)"
        css={css`
          background: linear-gradient(to right, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          background-clip: text;
        `}
      >
        FATEC ERP
      </Text>
    </Box>
  );
};

export default Logo;
