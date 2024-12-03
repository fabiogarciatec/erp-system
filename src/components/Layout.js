import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';
function Layout({ children }) {
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (_jsxs(Flex, { h: "100vh", bg: bgColor, children: [_jsx(Sidebar, { onClose: onClose }), _jsxs(Box, { flex: "1", ml: "240px" // Largura do menu lateral
                , minH: "100vh", bg: bgColor, position: "relative", children: [_jsx(Box, { position: "fixed", top: 0, right: 0, left: "240px" // Mesma largura do menu lateral
                        , bg: bgColor, zIndex: 2, children: _jsx(Header, {}) }), _jsx(Box, { bg: bgColor, as: "main", pt: "64px" // Altura do header
                        , minH: "calc(100vh - 64px)", overflowY: "auto", children: children })] })] }));
}
export default Layout;
