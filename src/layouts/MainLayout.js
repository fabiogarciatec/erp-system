import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
export function MainLayout({ children }) {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    return (_jsxs(Box, { minH: "100vh", bg: bgColor, children: [_jsx(TopBar, {}), _jsx(Sidebar, { onClose: () => { }, display: { base: 'none', md: 'block' } }), _jsx(Box, { ml: { base: 0, md: "64" }, mt: "16", pt: 6, maxW: "100%", h: "calc(100vh - 4rem)", overflowY: "auto", children: _jsx(Box, { px: 16, children: children }) })] }));
}
