import { Box, Container, useDisclosure } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      <Sidebar display={{ base: 'none', md: 'block' }} onClose={onClose} />
      <Box ml={{ base: 0, md: 64 }}>
        <TopBar />
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
