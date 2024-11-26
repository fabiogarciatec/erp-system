import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Sidebar />
      <TopBar />
      {/* Conteúdo principal com margem para Sidebar e TopBar */}
      <Box
        ml={{ base: 0, md: 60 }}
        mt="16"
        p="4"
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>
    </Box>
  );
}
