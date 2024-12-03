import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, Avatar, VStack, MenuDivider, Portal } from '@chakra-ui/react';
import { FiBell, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useProfile } from '../hooks/useProfile';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
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
            if (error)
                throw error;
            navigate('/login');
        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    };
    return (_jsx(Box, { as: "header", bg: bgColor, borderBottom: "1px", borderColor: borderColor, px: "4", py: "2", position: "sticky", top: "0", zIndex: "sticky", children: _jsx(Flex, { justify: "flex-end", align: "center", children: _jsxs(HStack, { spacing: "4", children: [_jsx(IconButton, { "aria-label": "Toggle color mode", icon: colorMode === 'light' ? _jsx(FiMoon, {}) : _jsx(FiSun, {}), onClick: toggleColorMode, variant: "ghost" }), _jsx(IconButton, { "aria-label": "Notifications", icon: _jsx(FiBell, {}), variant: "ghost" }), _jsxs(Menu, { children: [_jsx(MenuButton, { children: _jsxs(HStack, { spacing: "3", children: [_jsx(Avatar, { size: "sm", name: profile?.full_name || 'User', src: profile?.avatar_url || undefined }), _jsxs(VStack, { display: { base: 'none', md: 'flex' }, alignItems: "flex-start", spacing: "1px", ml: "2", children: [_jsx(Text, { fontSize: "sm", fontWeight: "medium", color: textColor, children: profile?.full_name || 'User' }), _jsx(Text, { fontSize: "xs", color: emailColor, children: profile?.email })] })] }) }), _jsx(Portal, { children: _jsxs(MenuList, { zIndex: 1500, children: [_jsx(MenuItem, { as: RouterLink, to: "/configuracoes/perfil", icon: _jsx(FiUser, {}), children: "Perfil" }), _jsx(MenuDivider, {}), _jsx(MenuItem, { onClick: handleLogout, icon: _jsx(FiLogOut, {}), children: "Sair" })] }) })] })] }) }) }));
}
export default Header;
