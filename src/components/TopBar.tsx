import {
  Box,
  Flex,
  Avatar,
  Text,
  HStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Container,
} from '@chakra-ui/react';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function TopBar() {
  const navigate = useNavigate();
  const { usuario, empresa, signOut } = useAuth();
  
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.600, purple.600)',
    'linear(to-r, blue.900, purple.900)'
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Box
      as="header"
      position="fixed"
      w="full"
      bg={useColorModeValue('white', 'gray.800')}
      borderBottom="1px"
      borderColor={borderColor}
      height="16"
      zIndex={2}
      left={0}
      right={0}
      top={0}
    >
      <Container maxW="full" h="full">
        <Flex alignItems="center" justifyContent="space-between" h="full" px={4}>
          <HStack spacing={8} alignItems="center">
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={textColor}
              display={{ base: 'none', md: 'block' }}
            >
              {empresa?.nome || 'ERP System'}
            </Text>
          </HStack>

          <Flex alignItems="center">
            <Menu>
              <MenuButton>
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={usuario?.nome || ''}
                  />
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <Text fontWeight="medium" fontSize="sm" color={textColor}>
                      {usuario?.nome || ''}
                    </Text>
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiSettings />} onClick={handleProfileClick}>
                  Configurações
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                  Sair
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
