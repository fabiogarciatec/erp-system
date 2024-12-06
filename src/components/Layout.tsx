import { Box, Flex, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  // Hooks do contexto
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  
  // Hooks de media query
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  
  // Hooks de tema
  const bg = useColorModeValue('gray.50', 'gray.900');
  const gradientColors = useColorModeValue(
    'linear(to-r, blue.200, purple.300)',
    'linear(to-r, blue.600, purple.700)'
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const scrollbarThumbColor = useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)');
  const scrollbarThumbHoverColor = useColorModeValue('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.5)');
  const scrollbarThumbColorDark = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)');
  const scrollbarThumbHoverColorDark = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(0, 0, 0, 0.2)');
  
  // Estilos do scrollbar
  const scrollbarStyles = {
    '::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
      display: 'none',
    },
    '&:hover::-webkit-scrollbar': {
      display: 'block',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'transparent',
      borderRadius: '20px',
      border: '2px solid transparent',
      boxShadow: 'inset 0 0 0 10px',
      color: 'transparent',
      transition: 'color 0.2s ease',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      color: scrollbarThumbColor,
    },
    '&:hover::-webkit-scrollbar-thumb:hover': {
      color: scrollbarThumbHoverColor,
    }
  };

  // Se não houver usuário logado, renderiza apenas o conteúdo sem sidebar e header
  if (!user) {
    return (
      <Box as="main" minH="100vh" bg={bg}>
        {children}
      </Box>
    );
  }

  return (
    <Box minH="100vh" w="100%" position="relative" bg={bg}>
      <Flex minH="100vh" position="relative">
        {/* Menu Lateral */}
        <Box
          as="nav"
          pos="fixed"
          top="0"
          left="0"
          zIndex="sticky"
          h="full"
          pb="10"
          overflowX="hidden"
          overflowY="auto"
          bg={bg}
          borderColor={borderColor}
          borderRightWidth="1px"
          w="60"
          display={{ base: 'none', md: 'block' }}
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(0, 0, 0, 0.2)',
            },
            '[data-theme="dark"] &::-webkit-scrollbar-thumb': {
              background: scrollbarThumbColorDark,
            },
            '[data-theme="dark"] &::-webkit-scrollbar-thumb:hover': {
              background: scrollbarThumbHoverColorDark,
            },
          }}
        >
          <Sidebar />
        </Box>
        
        {/* Área Principal */}
        <Box
          flex={1}
          ml={{ base: 0, md: "240px" }}
          transition=".3s ease"
          minH="100vh"
          display="flex"
          flexDirection="column"
          position="relative"
          bg={bg}
          w={{ base: "100%", md: "calc(100% - 240px)" }}
        >
          {/* Header fixo no topo */}
          <Box
            position="fixed"
            top={0}
            right={0}
            left={{ base: 0, md: "240px" }}
            zIndex={1000}
            bg={bg}
            transition="left .3s ease"
          >
            <Header />
            <Box
              h="2px"
              bgGradient={gradientColors}
              opacity={0.6}
            />
          </Box>

          {/* Conteúdo principal */}
          <Box
            as="main"
            flex="1"
            overflowY="auto"
            overflowX="hidden"
            bg={bg}
            position="relative"
            w="100%"
            pt={{ base: "40px", md: "45px" }}
            sx={scrollbarStyles}
          >
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Layout;
