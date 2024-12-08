import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, useColorModeValue } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
export function MainLayout({ children }) {
    const bg = useColorModeValue('white', 'gray.800');
    return (_jsxs(Box, { display: "flex", height: "100vh", bg: bg, children: [_jsx(TopBar, {}), _jsx(Sidebar, { display: { base: 'none', md: 'block' } }), _jsx(Box, { ml: { base: 0, md: "64" }, mt: "16", flex: "1", position: "relative", bg: "inherit", children: children })] }));
}
