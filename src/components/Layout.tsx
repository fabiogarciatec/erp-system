import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" ml="60">
        <Header />
        <Box as="main" p="4">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

export default Layout;
