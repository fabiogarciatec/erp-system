import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Heading, Text } from '@chakra-ui/react';
export function HelloWorld() {
    console.log('HelloWorld: Renderizando página');
    return (_jsxs(Box, { p: 8, children: [_jsx(Heading, { mb: 4, children: "Hello World!" }), _jsx(Text, { children: "Login realizado com sucesso!" })] }));
}
