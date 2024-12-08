import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardBody, Container, Flex, FormControl, FormLabel, Heading, Hide, Input, Show, Stack, Text, useToast, useColorMode, VStack, } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { InputMaskChakra } from '@/components/InputMaskChakra';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyDocument, setCompanyDocument] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { colorMode } = useColorMode();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isRegistering) {
                if (!companyName || !companyDocument) {
                    throw new Error('Nome e CNPJ da empresa são obrigatórios');
                }
                await register({
                    email,
                    password,
                    companyName,
                    companyDocument,
                    companyEmail,
                    companyPhone
                });
                toast({
                    title: 'Registro realizado com sucesso!',
                    description: 'Por favor, verifique seu e-mail para confirmar o cadastro.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setIsRegistering(false);
            }
            else {
                await login(email, password);
                navigate('/dashboard');
            }
        }
        catch (error) {
            setError(error.message);
            toast({
                title: 'Erro',
                description: error.message || 'Ocorreu um erro. Tente novamente.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Box, { minH: "100vh", w: "100vw", m: "0", p: { base: 4, md: 8 }, bg: colorMode === 'dark'
            ? 'linear-gradient(135deg, #1A365D 0%, #2D3748 100%)'
            : 'linear-gradient(135deg, #0396FF 0%, #ABDCFF 100%)', display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: "0", left: "0", right: "0", bottom: "0", overflowY: "auto", children: [_jsx(Hide, { below: 'md', children: _jsxs(Card, { direction: { base: 'column', md: 'row' }, overflow: "hidden", variant: "outline", maxW: "900px", maxH: { base: "auto", md: isRegistering ? "700px" : "500px" }, w: "90%", boxShadow: "xl", borderRadius: "xl", mx: "auto", my: { base: 4, md: 8 }, children: [_jsx(Box, { flex: "1", bg: colorMode === 'dark'
                                ? 'linear-gradient(135deg, #2D3748 0%, #1A365D 100%)'
                                : 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)', p: 8, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "xl", boxShadow: colorMode === 'dark'
                                ? 'inset 0 0 20px rgba(0, 0, 0, 0.3)'
                                : 'inset 0 0 20px rgba(74, 144, 226, 0.1)', children: _jsxs(Flex, { direction: { base: 'row', md: 'column' }, align: "center", justify: "center", gap: { base: 4, md: 8 }, children: [_jsx(Heading, { fontSize: '4xl', textAlign: { base: 'left', md: 'center' }, mb: { base: 0, md: 4 }, mr: { base: 4, md: 0 }, color: colorMode === 'dark' ? '#CBD5E0' : '#666', position: "relative", top: "35px", children: isRegistering ? 'Criar Conta' : 'Login' }), _jsx(Box, { w: { base: '150px', md: '400px' }, h: { base: '100px', md: 'auto' }, ml: { base: 'auto', md: 0 }, children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 400 300", style: {
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: '400px',
                                                objectFit: 'contain'
                                            }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "logoGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", style: { stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' } }), _jsx("stop", { offset: "100%", style: { stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' } })] }), _jsxs("linearGradient", { id: "arrowGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", style: { stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' } }), _jsx("stop", { offset: "100%", style: { stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' } })] }), _jsxs("filter", { id: "glow", children: [_jsx("feGaussianBlur", { stdDeviation: "2", result: "coloredBlur" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "coloredBlur" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] })] }), _jsxs("g", { transform: "translate(120, 30)", children: [_jsx("text", { x: "0", y: "25", fill: "url(#logoGradient)", filter: colorMode === 'dark' ? 'url(#glow)' : 'none', style: {
                                                                fontSize: '28px',
                                                                fontWeight: 'bold',
                                                                fontFamily: 'Arial',
                                                                letterSpacing: '1px'
                                                            }, children: "FATEC" }), _jsx("text", { x: "110", y: "25", fill: colorMode === 'dark' ? '#FC8181' : '#E53E3E', style: {
                                                                fontSize: '28px',
                                                                fontWeight: 'bold',
                                                                fontFamily: 'Arial'
                                                            }, children: "ERP" }), _jsx("path", { d: "M85 15 L100 15 L100 5 L120 20 L100 35 L100 25 L85 25 Z", fill: "url(#arrowGradient)" })] }), _jsx("text", { x: "200", y: "78", textAnchor: "middle", fill: colorMode === 'dark' ? '#CBD5E0' : '#666', style: {
                                                        fontSize: '13px',
                                                        fontFamily: 'Arial',
                                                        letterSpacing: '0.5px'
                                                    }, children: "Gest\u00E3o Empresarial Inteligente" }), _jsx("rect", { x: "120", y: "90", width: "160", height: "120", rx: "8", fill: "#ffffff", stroke: "url(#logoGradient)", strokeWidth: "2", filter: "url(#shadow)" }), _jsxs("g", { transform: "translate(130, 100)", children: [_jsx("rect", { x: "10", y: "10", width: "15", height: "40", fill: "url(#logoGradient)", rx: "2" }), _jsx("rect", { x: "30", y: "20", width: "15", height: "30", fill: "url(#logoGradient)", rx: "2" }), _jsx("rect", { x: "50", y: "15", width: "15", height: "35", fill: "url(#logoGradient)", rx: "2" }), _jsx("path", { d: "M10 70 Q40 40 80 60", stroke: "url(#logoGradient)", strokeWidth: "2", fill: "none", strokeLinecap: "round" }), _jsx("circle", { cx: "120", cy: "40", r: "25", fill: "none", stroke: "url(#logoGradient)", strokeWidth: "4", strokeDasharray: "110,40" })] }), _jsx("rect", { x: "140", y: "210", width: "120", height: "10", rx: "5", fill: "url(#logoGradient)" }), _jsx("rect", { x: "180", y: "220", width: "40", height: "5", rx: "2.5", fill: "url(#logoGradient)" }), _jsxs("g", { children: [_jsx("g", { transform: "translate(80, 120)", children: [0, 40, 80].map((y, i) => (_jsx("rect", { x: "0", y: y, width: "30", height: "30", rx: "6", fill: "#f8faff", stroke: "url(#logoGradient)", strokeWidth: "2" }, i))) }), _jsx("g", { transform: "translate(290, 120)", children: [0, 40, 80].map((y, i) => (_jsx("rect", { x: "0", y: y, width: "30", height: "30", rx: "6", fill: "#f8faff", stroke: "url(#logoGradient)", strokeWidth: "2" }, i))) })] }), _jsxs("g", { stroke: "url(#logoGradient)", strokeWidth: "1", strokeDasharray: "3,3", children: [_jsx("path", { d: "M110 135 h10 M280 135 h10" }), _jsx("path", { d: "M110 175 h10 M280 175 h10" }), _jsx("path", { d: "M110 215 h10 M280 215 h10" })] }), _jsx("circle", { cx: "80", cy: "90", r: "4", fill: "url(#logoGradient)" }), _jsx("circle", { cx: "320", cy: "90", r: "4", fill: "url(#logoGradient)" }), _jsx("circle", { cx: "200", cy: "250", r: "4", fill: "url(#logoGradient)" }), _jsx("text", { x: "200", y: "270", textAnchor: "middle", fill: colorMode === 'dark' ? '#CBD5E0' : '#666', style: {
                                                        fontSize: '12px',
                                                        fontFamily: 'Arial',
                                                        letterSpacing: '0.5px'
                                                    }, children: "FatecInfo Tecnologia\u00AE" })] }) })] }) }), _jsx(CardBody, { flex: "1", py: 30, px: { base: 4, md: 8 }, bg: colorMode === 'dark' ? 'gray.700' : 'white', boxShadow: "inset 0 0 20px rgba(74, 144, 226, 0.1)", overflowY: "auto", children: _jsx(LoginForm, { isRegistering: isRegistering, setIsRegistering: setIsRegistering, handleSubmit: handleSubmit, isLoading: isLoading, email: email, setEmail: setEmail, password: password, setPassword: setPassword, companyName: companyName, setCompanyName: setCompanyName, companyDocument: companyDocument, setCompanyDocument: setCompanyDocument, companyEmail: companyEmail, setCompanyEmail: setCompanyEmail, companyPhone: companyPhone, setCompanyPhone: setCompanyPhone, error: error }) })] }) }), _jsx(Show, { below: 'md', children: _jsx(Container, { maxW: "container.xl", py: 6, children: _jsx(Card, { maxH: { base: isRegistering ? "85vh" : "auto" }, overflow: "hidden", children: _jsxs(CardBody, { py: 30, px: 4, bg: colorMode === 'dark' ? 'gray.700' : 'white', boxShadow: "inset 0 0 20px rgba(74, 144, 226, 0.1)", overflowY: "auto", children: [_jsx(Stack, { direction: { base: 'column', md: 'row' }, align: "center", justify: "center", gap: { base: 4, md: 8 }, children: _jsx(Box, { w: { base: '150px', md: '400px' }, h: { base: '100px', md: 'auto' }, ml: { base: 'auto', md: 0 }, children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 400 300", style: {
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: '400px',
                                                objectFit: 'contain'
                                            }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "logoGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", style: { stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' } }), _jsx("stop", { offset: "100%", style: { stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' } })] }), _jsxs("linearGradient", { id: "arrowGradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", style: { stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' } }), _jsx("stop", { offset: "100%", style: { stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' } })] })] }), _jsxs("g", { transform: "translate(120, 30)", children: [_jsx("text", { x: "0", y: "25", fill: "url(#logoGradient)", style: {
                                                                fontSize: '28px',
                                                                fontWeight: 'bold',
                                                                fontFamily: 'Arial',
                                                                letterSpacing: '1px'
                                                            }, children: "FATEC" }), _jsx("text", { x: "110", y: "25", fill: colorMode === 'dark' ? '#FC8181' : '#E53E3E', style: {
                                                                fontSize: '28px',
                                                                fontWeight: 'bold',
                                                                fontFamily: 'Arial'
                                                            }, children: "ERP" }), _jsx("path", { d: "M85 15 L100 15 L100 5 L120 20 L100 35 L100 25 L85 25 Z", fill: "url(#arrowGradient)" })] }), _jsx("text", { x: "200", y: "78", textAnchor: "middle", fill: colorMode === 'dark' ? '#CBD5E0' : '#666', style: {
                                                        fontSize: '13px',
                                                        fontFamily: 'Arial',
                                                        letterSpacing: '0.5px'
                                                    }, children: "Gest\u00E3o Empresarial Inteligente" }), _jsx("rect", { x: "120", y: "90", width: "160", height: "120", rx: "8", fill: "#ffffff", stroke: "url(#logoGradient)", strokeWidth: "2", filter: "url(#shadow)" }), _jsxs("g", { transform: "translate(130, 100)", children: [_jsx("rect", { x: "10", y: "10", width: "15", height: "40", fill: "url(#logoGradient)", rx: "2" }), _jsx("rect", { x: "30", y: "20", width: "15", height: "30", fill: "url(#logoGradient)", rx: "2" }), _jsx("rect", { x: "50", y: "15", width: "15", height: "35", fill: "url(#logoGradient)", rx: "2" }), _jsx("path", { d: "M10 70 Q40 40 80 60", stroke: "url(#logoGradient)", strokeWidth: "2", fill: "none", strokeLinecap: "round" }), _jsx("circle", { cx: "120", cy: "40", r: "25", fill: "none", stroke: "url(#logoGradient)", strokeWidth: "4", strokeDasharray: "110,40" })] }), _jsx("rect", { x: "140", y: "210", width: "120", height: "10", rx: "5", fill: "url(#logoGradient)" }), _jsx("rect", { x: "180", y: "220", width: "40", height: "5", rx: "2.5", fill: "url(#logoGradient)" }), _jsxs("g", { children: [_jsx("g", { transform: "translate(80, 120)", children: [0, 40, 80].map((y, i) => (_jsx("rect", { x: "0", y: y, width: "30", height: "30", rx: "6", fill: "#f8faff", stroke: "url(#logoGradient)", strokeWidth: "2" }, i))) }), _jsx("g", { transform: "translate(290, 120)", children: [0, 40, 80].map((y, i) => (_jsx("rect", { x: "0", y: y, width: "30", height: "30", rx: "6", fill: "#f8faff", stroke: "url(#logoGradient)", strokeWidth: "2" }, i))) })] }), _jsxs("g", { stroke: "url(#logoGradient)", strokeWidth: "1", strokeDasharray: "3,3", children: [_jsx("path", { d: "M110 135 h10 M280 135 h10" }), _jsx("path", { d: "M110 175 h10 M280 175 h10" }), _jsx("path", { d: "M110 215 h10 M280 215 h10" })] }), _jsx("circle", { cx: "80", cy: "90", r: "4", fill: "url(#logoGradient)" }), _jsx("circle", { cx: "320", cy: "90", r: "4", fill: "url(#logoGradient)" }), _jsx("circle", { cx: "200", cy: "250", r: "4", fill: "url(#logoGradient)" }), _jsx("text", { x: "200", y: "270", textAnchor: "middle", fill: colorMode === 'dark' ? '#CBD5E0' : '#666', style: {
                                                        fontSize: '12px',
                                                        fontFamily: 'Arial',
                                                        letterSpacing: '0.5px'
                                                    }, children: "FatecInfo Tecnologia\u00AE" })] }) }) }), _jsx(LoginForm, { isRegistering: isRegistering, setIsRegistering: setIsRegistering, handleSubmit: handleSubmit, isLoading: isLoading, email: email, setEmail: setEmail, password: password, setPassword: setPassword, companyName: companyName, setCompanyName: setCompanyName, companyDocument: companyDocument, setCompanyDocument: setCompanyDocument, companyEmail: companyEmail, setCompanyEmail: setCompanyEmail, companyPhone: companyPhone, setCompanyPhone: setCompanyPhone, error: error })] }) }) }) })] }));
}
const LoginForm = ({ isRegistering, setIsRegistering, handleSubmit, isLoading, email, setEmail, password, setPassword, companyName, setCompanyName, companyDocument, setCompanyDocument, companyEmail, setCompanyEmail, companyPhone, setCompanyPhone, error }) => {
    const { colorMode } = useColorMode();
    return (_jsx("form", { onSubmit: handleSubmit, children: _jsxs(VStack, { spacing: { base: 3, md: 4 }, align: "stretch", children: [isRegistering && (_jsxs(_Fragment, { children: [_jsxs(FormControl, { isRequired: true, size: "sm", children: [_jsx(FormLabel, { fontSize: { base: "sm", md: "md" }, children: "Nome da Empresa" }), _jsx(Input, { type: "text", value: companyName, onChange: (e) => setCompanyName(e.target.value), placeholder: "Digite o nome da empresa", size: { base: "sm", md: "md" } })] }), _jsxs(FormControl, { isRequired: true, size: "sm", children: [_jsx(FormLabel, { fontSize: { base: "sm", md: "md" }, children: "CNPJ" }), _jsx(InputMaskChakra, { mask: "99.999.999/9999-99", value: companyDocument, onChange: (e) => setCompanyDocument(e.target.value), placeholder: "Digite o CNPJ", size: { base: "sm", md: "md" } })] }), _jsxs(FormControl, { size: "sm", children: [_jsx(FormLabel, { fontSize: { base: "sm", md: "md" }, children: "E-mail da Empresa" }), _jsx(Input, { type: "email", value: companyEmail, onChange: (e) => setCompanyEmail(e.target.value), placeholder: "Digite o e-mail da empresa", size: { base: "sm", md: "md" } })] }), _jsxs(FormControl, { size: "sm", children: [_jsx(FormLabel, { fontSize: { base: "sm", md: "md" }, children: "Telefone da Empresa" }), _jsx(InputMaskChakra, { mask: "(99) 99999-9999", value: companyPhone, onChange: (e) => setCompanyPhone(e.target.value), placeholder: "Digite o telefone da empresa", size: { base: "sm", md: "md" } })] })] })), _jsxs(FormControl, { isRequired: true, size: "sm", children: [_jsx(FormLabel, { fontSize: { base: "sm", md: "md" }, children: "E-mail" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Digite seu e-mail", size: { base: "sm", md: "md" } })] }), _jsxs(FormControl, { isRequired: true, size: "sm", children: [_jsx(FormLabel, { fontSize: { base: "sm", md: "md" }, children: "Senha" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Digite sua senha", size: { base: "sm", md: "md" } })] }), _jsx(Button, { type: "submit", colorScheme: "blue", size: { base: "sm", md: "md" }, isLoading: isLoading, w: "full", mt: { base: 2, md: 4 }, children: isRegistering ? 'Criar Conta' : 'Entrar' }), _jsx(Button, { variant: "ghost", onClick: () => setIsRegistering(!isRegistering), size: { base: "sm", md: "md" }, mt: 1, children: isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Crie aqui' }), error && (_jsx(Text, { color: "red.500", fontSize: { base: "sm", md: "md" }, textAlign: "center", mt: 2, children: error }))] }) }));
};
