import { Box, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box display="flex" minH="100vh">
      <Sidebar onClose={onClose} display={{ base: isOpen ? 'block' : 'none', md: 'block' }} />
      <Box
        flex="1"
        ml={{ base: 0, md: 60 }}
        transition=".3s ease"
      >
        <TopBar />
        <Box
          p={8}
          bg="gray.50"
          mt="16" // Altura da TopBar
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
