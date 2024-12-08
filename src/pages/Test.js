import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from '@chakra-ui/react';
export function Test() {
    return (_jsx(Box, { p: 8, children: _jsx(Text, { fontSize: "2xl", children: "Hello World - P\u00E1gina de Teste" }) }));
}
