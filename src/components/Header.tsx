import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMoon, FiSun, FiBell } from 'react-icons/fi';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px="4"
      py="2"
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
              <HStack>
                <Avatar
                  size="sm"
                  name="Admin User"
                  src="https://bit.ly/broken-link"
                />
                <Text display={{ base: 'none', md: 'block' }}>
                  Admin User
                </Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem as="a" href="/settings/profile">
                Meu Perfil
              </MenuItem>
              <MenuItem as="a" href="/settings">
                Configurações
              </MenuItem>
              <MenuItem>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;
