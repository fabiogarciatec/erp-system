import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box display="flex" height="100vh" bg={bg}>
      <TopBar />
      <Sidebar
        display={{ base: 'none', md: 'block' }}
      />
      <Box 
        ml={{ base: 0, md: "64" }}
        mt="16"
        flex="1"
        position="relative"
        bg="inherit"
      >
        {children}
      </Box>
    </Box>
  );
}
