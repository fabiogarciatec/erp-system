import { Box } from '@chakra-ui/react';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box minH="100vh">
      <Sidebar />
      <Box ml="64" p={8}>
        {children}
      </Box>
    </Box>
  );
}
