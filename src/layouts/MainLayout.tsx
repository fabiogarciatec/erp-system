import { Box, useColorModeValue } from '@chakra-ui/react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box minH="100vh" bg={bgColor}>
      <TopBar />
      <Sidebar
        onClose={() => {}}
        display={{ base: 'none', md: 'block' }}
      />
      <Box 
        ml={{ base: 0, md: "64" }}
        mt="16"
        pt={6}
        maxW="100%"
        h="calc(100vh - 4rem)"
        overflowY="auto"
      >
        <Box px={16}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
