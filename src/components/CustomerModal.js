import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Select, VStack, Textarea, useToast, } from '@chakra-ui/react';
import supabase from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
export function CustomerModal({ isOpen, onClose, customer, onSuccess }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [tipo, setTipo] = useState(null);
    const [observacoes, setObservacoes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const toast = useToast();
    useEffect(() => {
        if (customer) {
            setNome(customer.nome || '');
            setEmail(customer.email || '');
            setTelefone(formatPhoneInput(customer.telefone || ''));
            setCpfCnpj(formatCpfCnpj(customer.cpf_cnpj || ''));
            setTipo(customer.tipo);
            setObservacoes(customer.observacoes || '');
        }
        else {
            resetForm();
        }
    }, [customer]);
    const resetForm = () => {
        setNome('');
        setEmail('');
        setTelefone('');
        setCpfCnpj('');
        setTipo(null);
        setObservacoes('');
    };
    const formatPhoneInput = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };
    const handlePhoneChange = (e) => {
        const formattedValue = formatPhoneInput(e.target.value);
        setTelefone(formattedValue);
    };
    const formatCpfCnpj = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };
    const handleCpfCnpjChange = (e) => {
        const formattedValue = formatCpfCnpj(e.target.value);
        setCpfCnpj(formattedValue);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.currentCompany) {
            toast({
                title: 'Erro',
                description: 'Usuário não está associado a uma empresa',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        try {
            setIsLoading(true);
            const phoneNumbers = telefone.replace(/\D/g, '');
            const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
            const customerData = {
                nome,
                email: email || null,
                telefone: phoneNumbers || null,
                empresa_id: user.currentCompany.id,
                cpf_cnpj: cleanCpfCnpj || null,
                tipo: tipo || 'individual',
                observacoes: observacoes || null,
                created_at: new Date().toISOString(),
                created_by: user.id,
                updated_at: new Date().toISOString(),
            };
            if (customer?.id) {
                const { error } = await supabase
                    .from('customers')
                    .update(customerData)
                    .eq('id', customer.id);
                if (error)
                    throw error;
            }
            else {
                const { error } = await supabase
                    .from('customers')
                    .insert([{
                        ...customerData,
                        created_at: new Date().toISOString()
                    }]);
                if (error)
                    throw error;
            }
            toast({
                title: customer ? 'Cliente atualizado' : 'Cliente criado',
                status: 'success',
                duration: 3000,
            });
            onSuccess();
            onClose();
            resetForm();
        }
        catch (error) {
            console.error('Erro ao salvar cliente:', error);
            toast({
                title: 'Erro ao salvar',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "xl", children: [_jsx(ModalOverlay, {}), _jsx(ModalContent, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(ModalHeader, { children: customer ? 'Editar Cliente' : 'Novo Cliente' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome" }), _jsx(Input, { value: nome, onChange: (e) => setNome(e.target.value), placeholder: "Nome do cliente" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "E-mail" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "email@exemplo.com" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Telefone" }), _jsx(Input, { value: telefone, onChange: handlePhoneChange, placeholder: "(00) 00000-0000", maxLength: 15 })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Tipo" }), _jsxs(Select, { value: tipo || '', onChange: (e) => setTipo(e.target.value), placeholder: "Selecione o tipo", children: [_jsx("option", { value: "individual", children: "Pessoa F\u00EDsica" }), _jsx("option", { value: "corporate", children: "Pessoa Jur\u00EDdica" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: tipo === 'individual' ? 'CPF' : 'CNPJ' }), _jsx(Input, { value: cpfCnpj, onChange: handleCpfCnpjChange, placeholder: tipo === 'individual' ? '000.000.000-00' : '00.000.000/0000-00', maxLength: tipo === 'individual' ? 14 : 18 })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Observa\u00E7\u00F5es" }), _jsx(Textarea, { value: observacoes, onChange: (e) => setObservacoes(e.target.value), placeholder: "Observa\u00E7\u00F5es sobre o cliente", rows: 3 })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", type: "submit", isLoading: isLoading, children: customer ? 'Atualizar' : 'Criar' })] })] }) })] }));
}
