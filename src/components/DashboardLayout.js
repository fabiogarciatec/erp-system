import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';
export default function DashboardLayout({ children }) {
    return (_jsxs(Box, { minH: "100vh", bg: "gray.50", children: [_jsx(Sidebar, { onClose: () => { }, display: { base: 'none', md: 'block' } }), _jsx(Box, { ml: { base: 0, md: 60 }, p: "4", position: "relative", zIndex: 1, children: children })] }));
}
