import { Box, Container, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box
        flex="1"
        ml={{ base: 0, md: "240px" }}
        transition=".3s ease"
      >
        <Box
          as="main"
          minH="100vh"
          bg="gray.50"
          p={{ base: 4, md: 8 }}
        >
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
