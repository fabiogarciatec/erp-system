import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { theme } from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <CompanyProvider>
            <AppRoutes />
          </CompanyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
