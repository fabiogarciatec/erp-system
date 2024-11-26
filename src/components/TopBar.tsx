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
  Image,
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
      left={0}
      bg={bgColor}
      px={4}
      borderBottom="1px"
      borderColor={borderColor}
      h="16"
      zIndex={1000}
    >
      <Flex h="full" alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Box>
          <Text 
            fontSize={{ base: "xl", md: "2xl" }} 
            fontWeight="bold"
            bgGradient="linear(to-r, blue.500, blue.600)"
            bgClip="text"
          >
            ERP FATEC
          </Text>
        </Box>

        {/* Perfil do usuário */}
        <Menu>
          <MenuButton
            as={Box}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          >
            <HStack spacing={2}>
              <Avatar
                size="sm"
                name={profile?.full_name}
                src={profile?.avatar_url}
              />
              <Box maxW={{ base: '150px', md: '200px' }}>
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  lineHeight="1.2"
                  noOfLines={1}
                >
                  {profile?.full_name}
                </Text>
                <Text 
                  fontSize="xs" 
                  color="blue.500" 
                  lineHeight="1.2"
                  noOfLines={1}
                >
                  {profile?.email}
                </Text>
              </Box>
              <IconButton
                aria-label="More options"
                icon={<FiChevronDown />}
                variant="ghost"
                size="sm"
              />
            </HStack>
          </MenuButton>
          <MenuList zIndex={1001}>
            <MenuItem icon={<FiSettings />} onClick={handleProfileClick}>
              Perfil
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
