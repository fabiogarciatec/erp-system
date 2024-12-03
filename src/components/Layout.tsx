import { Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h="100vh" bg={bgColor}>
      {/* Menu Lateral */}
      <Sidebar onClose={onClose} />
      
      {/* Área Principal */}
      <Box 
        flex="1" 
        ml="240px" // Largura do menu lateral
        minH="100vh"
        bg={bgColor}
        position="relative"
      >
        {/* Header fixo no topo */}
        <Box
          position="fixed"
          top={0}
          right={0}
          left="240px" // Mesma largura do menu lateral
          bg={bgColor}
          zIndex={2}
        >
          <Header />
        </Box>

        {/* Conteúdo principal com padding-top para compensar o header fixo */}
        <Box 
          bg={bgColor}
          as="main"
          pt="64px" // Altura do header
          minH="calc(100vh - 64px)"
          overflowY="auto"
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

export default Layout;
