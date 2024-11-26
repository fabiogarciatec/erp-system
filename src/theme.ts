import { theme as baseTheme } from '@chakra-ui/react'

const theme = {
  ...baseTheme,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
};

export default theme;
