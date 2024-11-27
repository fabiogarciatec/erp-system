import { Box, useColorModeValue } from '@chakra-ui/react';
import { Sidebar } from '@/components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar
        onClose={() => {}}
        display={{ base: 'none', md: 'block' }}
      />
      <Box ml="64" p={8}>
        {children}
      </Box>
    </Box>
  );
}
