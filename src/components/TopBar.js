import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Flex, Text, HStack, useColorModeValue, } from '@chakra-ui/react';
export function TopBar() {
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'white');
    const bgColor = useColorModeValue('white', 'gray.800');
    return (_jsx(Box, { as: "header", position: "fixed", w: "100vw", bg: bgColor, borderBottom: "1px", borderColor: borderColor, height: "16", zIndex: 1000, left: 0, right: 0, top: 0, children: _jsx(Flex, { alignItems: "center", justifyContent: "space-between", h: "full", px: 6, maxW: "100%", children: _jsx(HStack, { spacing: 8, alignItems: "center", children: _jsx(Text, { fontSize: "lg", fontWeight: "bold", color: textColor, display: { base: 'block', md: 'block' }, children: "ERP System" }) }) }) }));
}
