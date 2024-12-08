import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, Container } from '@chakra-ui/react';
export default function PlaceholderPage({ title }) {
    return (_jsx(Container, { maxW: "container.xl", py: 8, children: _jsxs(Box, { p: 8, bg: "white", borderRadius: "lg", boxShadow: "sm", textAlign: "center", children: [_jsx(Text, { fontSize: "2xl", fontWeight: "bold", mb: 4, children: title }), _jsx(Text, { color: "gray.600", children: "Esta p\u00E1gina est\u00E1 em desenvolvimento." })] }) }));
}
