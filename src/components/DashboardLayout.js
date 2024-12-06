import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
export function DashboardLayout({ children }) {
    return (_jsxs(Box, { minH: "100vh", bg: "gray.100", children: [_jsx(Header, {}), _jsx(Sidebar, { display: { base: 'none', md: 'block' } }), _jsx(Box, { ml: { base: 0, md: 60 }, p: "4", position: "relative", zIndex: 1, children: children })] }));
}
