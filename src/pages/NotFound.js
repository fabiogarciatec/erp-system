import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Heading, Text, Button, Container, VStack, } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
export default function NotFound() {
    const navigate = useNavigate();
    return (_jsx(Container, { maxW: "container.md", py: 10, children: _jsxs(VStack, { spacing: 6, align: "center", textAlign: "center", children: [_jsx(Heading, { size: "2xl", children: "404" }), _jsx(Heading, { size: "xl", children: "P\u00E1gina N\u00E3o Encontrada" }), _jsx(Text, { fontSize: "lg", color: "gray.600", children: "A p\u00E1gina que voc\u00EA est\u00E1 procurando n\u00E3o existe." }), _jsx(Button, { colorScheme: "blue", onClick: () => navigate('/'), children: "Voltar para o in\u00EDcio" })] }) }));
}
