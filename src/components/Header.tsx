import { Box, Flex, HStack, IconButton, Menu, MenuButton as ChakraMenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, Avatar, VStack, MenuDivider, Portal } from '@chakra-ui/react';
import { FiBell, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useProfile } from '../hooks/useProfile';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Profile } from '../types/profile';
import { useAuth } from '../contexts/AuthContext';
import { MenuButton } from './MenuButton';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const emailColor = useColorModeValue('blue.500', 'blue.300');
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Se não houver usuário logado, não renderiza o header
  if (!user) return null;

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      h="14"
      px="4"
      bg={bgColor}
      position="sticky"
      top="0"
      zIndex="docked"
    >
      <Box>
        <MenuButton />
      </Box>

      <Box flex="1" />

      <HStack spacing="3">
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
          size="sm"
        />

        <IconButton
          aria-label="Notifications"
          icon={<FiBell />}
          variant="ghost"
          size="sm"
        />

        <Menu>
          <ChakraMenuButton>
            <HStack spacing="3" cursor="pointer">
              <Avatar
                size="sm"
                name={profile?.full_name || user.email}
                src={profile?.avatar_url || undefined}
              />
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="0px"
                ml="2"
              >
                <Text fontSize="sm" color={textColor}>
                  {profile?.full_name || 'Usuário'}
                </Text>
                <Text fontSize="xs" color={emailColor}>
                  {user.email}
                </Text>
              </VStack>
            </HStack>
          </ChakraMenuButton>
          <Portal>
            <MenuList>
              <MenuItem as={RouterLink} to="/configuracoes/perfil" icon={<FiUser />}>
                Perfil
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={logout} icon={<FiLogOut />} color="red.400">
                Sair
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </HStack>
    </Flex>
  );
}

export default Header;
