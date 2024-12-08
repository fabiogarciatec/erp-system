import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.100">
      <Header />
      <Sidebar display={{ base: 'none', md: 'block' }} />
      {/* Conteúdo principal com margem apenas para Sidebar */}
      <Box
        ml={{ base: 0, md: 60 }}
        p="4"
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>
    </Box>
  );
}
