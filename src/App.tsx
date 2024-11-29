import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import { theme } from './styles/theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
