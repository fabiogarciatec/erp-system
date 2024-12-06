import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, useToast, VStack, Divider, Text, ModalCloseButton, } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
export function CadastroModal({ isOpen, onClose, onSuccess }) {
    // Dados do usuário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Dados da empresa
    const [nomeEmpresa, setNomeEmpresa] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const toast = useToast();
    const formatCNPJ = (value) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 2) {
            formatted = cleaned.slice(0, 2) + '.';
            if (cleaned.length >= 5) {
                formatted += cleaned.slice(2, 5) + '.';
                if (cleaned.length >= 8) {
                    formatted += cleaned.slice(5, 8) + '/';
                    if (cleaned.length >= 12) {
                        formatted += cleaned.slice(8, 12) + '-';
                        if (cleaned.length >= 14) {
                            formatted += cleaned.slice(12, 14);
                        }
                        else {
                            formatted += cleaned.slice(12);
                        }
                    }
                    else {
                        formatted += cleaned.slice(8);
                    }
                }
                else {
                    formatted += cleaned.slice(5);
                }
            }
            else {
                formatted += cleaned.slice(2);
            }
        }
        return formatted;
    };
    const handleCNPJChange = (e) => {
        const formatted = formatCNPJ(e.target.value);
        setCnpj(formatted);
    };
    const validateCNPJ = (cnpj) => {
        const cleaned = cnpj.replace(/\D/g, '');
        return cleaned.length === 14;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Validações
            if (password !== confirmPassword) {
                throw new Error('As senhas não coincidem');
            }
            if (password.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres');
            }
            if (!validateCNPJ(cnpj)) {
                throw new Error('CNPJ inválido');
            }
            // Cadastra usuário e empresa
            await register({
                email,
                password,
                companyName: nomeEmpresa,
                companyDocument: cnpj.replace(/\D/g, '')
            });
            toast({
                title: 'Cadastro realizado com sucesso!',
                description: 'Verifique seu email para confirmar o cadastro.',
                status: 'success',
                duration: 5000,
            });
            onSuccess?.();
            onClose();
        }
        catch (error) {
            console.error('Erro ao cadastrar:', error);
            toast({
                title: 'Erro ao cadastrar',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        setNome('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNomeEmpresa('');
        setCnpj('');
        onClose();
    };
    return (_jsxs(Modal, { isOpen: isOpen, onClose: handleClose, size: "lg", children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { as: "form", onSubmit: handleSubmit, children: [_jsx(ModalHeader, { children: "Criar Conta" }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 6, children: [_jsxs(VStack, { spacing: 4, width: "100%", children: [_jsx(Text, { fontWeight: "bold", alignSelf: "flex-start", children: "Dados do Usu\u00E1rio" }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome" }), _jsx(Input, { value: nome, onChange: (e) => setNome(e.target.value), placeholder: "Seu nome completo" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "seu@email.com" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Senha" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "M\u00EDnimo 6 caracteres" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Confirmar Senha" }), _jsx(Input, { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Digite a senha novamente" })] })] }), _jsx(Divider, {}), _jsxs(VStack, { spacing: 4, width: "100%", children: [_jsx(Text, { fontWeight: "bold", alignSelf: "flex-start", children: "Dados da Empresa" }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome da Empresa" }), _jsx(Input, { value: nomeEmpresa, onChange: (e) => setNomeEmpresa(e.target.value), placeholder: "Nome da empresa" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "CNPJ" }), _jsx(Input, { value: cnpj, onChange: handleCNPJChange, placeholder: "00.000.000/0000-00", maxLength: 18 })] })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: handleClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", type: "submit", isLoading: isLoading, loadingText: "Cadastrando...", children: "Criar Conta" })] })] })] }));
}
