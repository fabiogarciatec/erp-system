import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Heading, Text, Button, Container, VStack, } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
export default function Unauthorized() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    return (_jsx(Container, { maxW: "container.md", py: 10, children: _jsxs(VStack, { spacing: 6, align: "center", textAlign: "center", children: [_jsx(Heading, { size: "2xl", children: "401" }), _jsx(Heading, { size: "xl", children: "Acesso N\u00E3o Autorizado" }), _jsx(Text, { fontSize: "lg", color: "gray.600", children: "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar esta p\u00E1gina." }), _jsxs(Box, { children: [_jsx(Button, { colorScheme: "blue", mr: 4, onClick: () => navigate(-1), children: "Voltar" }), _jsx(Button, { variant: "outline", colorScheme: "blue", onClick: logout, children: "Sair" })] })] }) }));
}
