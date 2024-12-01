import { Box, Flex, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, Avatar, VStack, MenuDivider, Portal } from '@chakra-ui/react';
import { FiBell, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useProfile } from '../hooks/useProfile';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Profile } from '../types/profile';
import supabase from '../lib/supabase';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const emailColor = useColorModeValue('blue.500', 'blue.300');
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px="4"
      py="2"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex justify="flex-end" align="center">
        <HStack spacing="4">
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />

          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
            variant="ghost"
          />

          <Menu>
            <MenuButton>
              <HStack spacing="3">
                <Avatar
                  size="sm"
                  name={profile?.full_name || 'User'}
                  src={profile?.avatar_url || undefined}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {profile?.full_name || 'User'}
                  </Text>
                  <Text fontSize="xs" color={emailColor}>
                    {profile?.email}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <Portal>
              <MenuList zIndex={1500}>
                <MenuItem as={RouterLink} to="/configuracoes/perfil" icon={<FiUser />}>
                  Perfil
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout} icon={<FiLogOut />}>
                  Sair
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;
