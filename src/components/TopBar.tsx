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
  IconButton,
  Container,
} from '@chakra-ui/react';
import { FiChevronDown, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useProfile } from '../hooks/useProfile';
import { useEffect } from 'react';

export function TopBar() {
  const navigate = useNavigate();
  const { profile, fetchProfile } = useProfile();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/settings/profile');
  };

  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      left={{ base: 0, md: 60 }}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      h="16"
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="full" h="full">
        <Flex h="full" alignItems="center" justifyContent="space-between" px={4}>
          {/* Logo */}
          <Box>
          </Box>

          {/* Perfil do usuário */}
          <Menu>
            <MenuButton
              as={Box}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              transition="all 0.2s"
            >
              <HStack spacing={3}>
                <Avatar
                  size="sm"
                  name={profile?.full_name}
                  src={profile?.avatar_url}
                  bg="blue.500"
                />
                <Box maxW={{ base: '150px', md: '200px' }}>
                  <Text 
                    fontSize="sm" 
                    fontWeight="medium" 
                    lineHeight="1.2"
                    noOfLines={1}
                  >
                    {profile?.full_name || 'Carregando...'}
                  </Text>
                  <Text 
                    fontSize="xs" 
                    color="blue.500" 
                    lineHeight="1.2"
                    noOfLines={1}
                  >
                    {profile?.email || ''}
                  </Text>
                </Box>
                <IconButton
                  aria-label="More options"
                  icon={<FiChevronDown />}
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                />
              </HStack>
            </MenuButton>
            <MenuList zIndex={1001} shadow="lg" borderColor="gray.200">
              <MenuItem 
                icon={<FiSettings />} 
                onClick={handleProfileClick}
                _hover={{ bg: 'gray.50', color: 'blue.500' }}
              >
                Perfil
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                icon={<FiLogOut />} 
                onClick={handleLogout} 
                color="red.500"
                _hover={{ bg: 'red.50' }}
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
}
