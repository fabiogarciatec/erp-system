import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, HStack, IconButton, Menu, MenuButton as ChakraMenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, Avatar, VStack, MenuDivider, Portal } from '@chakra-ui/react';
import { FiBell, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useProfile } from '../hooks/useProfile';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
    if (!user)
        return null;
    return (_jsxs(Flex, { as: "header", align: "center", justify: "space-between", h: "14", px: "4", bg: bgColor, position: "sticky", top: "0", zIndex: "docked", children: [_jsx(Box, { children: _jsx(MenuButton, {}) }), _jsx(Box, { flex: "1" }), _jsxs(HStack, { spacing: "3", children: [_jsx(IconButton, { "aria-label": "Toggle color mode", icon: colorMode === 'light' ? _jsx(FiMoon, {}) : _jsx(FiSun, {}), onClick: toggleColorMode, variant: "ghost", size: "sm" }), _jsx(IconButton, { "aria-label": "Notifications", icon: _jsx(FiBell, {}), variant: "ghost", size: "sm" }), _jsxs(Menu, { children: [_jsx(ChakraMenuButton, { children: _jsxs(HStack, { spacing: "3", cursor: "pointer", children: [_jsx(Avatar, { size: "sm", name: profile?.full_name || user.email, src: profile?.avatar_url || undefined }), _jsxs(VStack, { display: { base: 'none', md: 'flex' }, alignItems: "flex-start", spacing: "0px", ml: "2", children: [_jsx(Text, { fontSize: "sm", color: textColor, children: profile?.full_name || 'Usuário' }), _jsx(Text, { fontSize: "xs", color: emailColor, children: user.email })] })] }) }), _jsx(Portal, { children: _jsxs(MenuList, { children: [_jsx(MenuItem, { as: RouterLink, to: "/configuracoes/perfil", icon: _jsx(FiUser, {}), children: "Perfil" }), _jsx(MenuDivider, {}), _jsx(MenuItem, { onClick: logout, icon: _jsx(FiLogOut, {}), color: "red.400", children: "Sair" })] }) })] })] })] }));
}
export default Header;
