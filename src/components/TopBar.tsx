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
import { Logo } from './Logo';

export function TopBar() {
  const navigate = useNavigate();
  const { profile, fetchProfile } = useProfile();
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.600, purple.600)',
    'linear(to-r, blue.900, purple.900)'
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('white', 'gray.100');

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
      left={0}
      zIndex={1000}
      bgGradient={bgGradient}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={2}
      color={textColor}
    >
      <Container maxW="full" h="full">
        <Flex h="full" alignItems="center" justifyContent="space-between" px={4}>
          <Logo />
          
          {/* Perfil do usuário */}
          <Menu>
            <MenuButton
              as={Box}
              cursor="pointer"
              color={textColor}
              _hover={{ opacity: 0.8 }}
              transition="all 0.2s"
            >
              <HStack spacing={3}>
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
                    color="blue.100" 
                    lineHeight="1.2"
                    noOfLines={1}
                  >
                    {profile?.email || ''}
                  </Text>
                </Box>
                <Avatar
                  size="sm"
                  name={profile?.full_name}
                  src={profile?.avatar_url}
                  bg="blue.100"
                  color="blue.600"
                />
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.800')}
              color={useColorModeValue('gray.800', 'white')}
              borderColor={borderColor}
              zIndex={1001}
              shadow="lg"
            >
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
