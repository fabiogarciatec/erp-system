import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, FormControl, FormLabel, Input, Stack, Table, Tbody, Td, Th, Thead, Tr, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, } from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
const categoriasIniciais = [
    {
        id: 1,
        nome: 'Eletrônicos',
        descricao: 'Produtos eletrônicos em geral',
        dataCriacao: '2024-01-15',
    },
    {
        id: 2,
        nome: 'Móveis',
        descricao: 'Móveis para casa e escritório',
        dataCriacao: '2024-01-15',
    },
    {
        id: 3,
        nome: 'Vestuário',
        descricao: 'Roupas e acessórios',
        dataCriacao: '2024-01-15',
    },
];
export default function Categorias() {
    const [categorias, setCategorias] = useState(categoriasIniciais);
    const [novaCategoria, setNovaCategoria] = useState({
        nome: '',
        descricao: '',
    });
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const handleAdicionarCategoria = () => {
        if (!novaCategoria.nome || !novaCategoria.descricao) {
            toast({
                title: 'Erro',
                description: 'Por favor, preencha todos os campos',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const novoId = Math.max(...categorias.map((cat) => cat.id)) + 1;
        const dataAtual = new Date().toISOString().split('T')[0];
        setCategorias([
            ...categorias,
            {
                id: novoId,
                ...novaCategoria,
                dataCriacao: dataAtual,
            },
        ]);
        setNovaCategoria({ nome: '', descricao: '' });
        onClose();
        toast({
            title: 'Sucesso',
            description: 'Categoria adicionada com sucesso',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    const handleEditarCategoria = (categoria) => {
        setCategoriaEditando(categoria);
        setNovaCategoria({
            nome: categoria.nome,
            descricao: categoria.descricao,
        });
        onOpen();
    };
    const handleSalvarEdicao = () => {
        if (!categoriaEditando)
            return;
        setCategorias(categorias.map((cat) => cat.id === categoriaEditando.id
            ? {
                ...cat,
                nome: novaCategoria.nome,
                descricao: novaCategoria.descricao,
            }
            : cat));
        setNovaCategoria({ nome: '', descricao: '' });
        setCategoriaEditando(null);
        onClose();
        toast({
            title: 'Sucesso',
            description: 'Categoria atualizada com sucesso',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    const handleExcluirCategoria = (id) => {
        setCategorias(categorias.filter((cat) => cat.id !== id));
        toast({
            title: 'Sucesso',
            description: 'Categoria excluída com sucesso',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    const handleExportCategories = () => {
        // Implementar lógica de exportação de categorias
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Categorias", subtitle: "Gerencie as categorias de produtos", breadcrumbs: [
                    { label: 'Cadastros', href: '/cadastros' },
                    { label: 'Categorias', href: '/cadastros/categorias' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportCategories, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: onOpen, children: "Nova Categoria" })] }) }), _jsx(Box, { mt: "154px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto", children: _jsx(Box, { bg: "white", p: 4, rounded: "md", shadow: "sm", children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "ID" }), _jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Descri\u00E7\u00E3o" }), _jsx(Th, { children: "Data de Cria\u00E7\u00E3o" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: categorias.map((categoria) => (_jsxs(Tr, { children: [_jsx(Td, { children: categoria.id }), _jsx(Td, { children: categoria.nome }), _jsx(Td, { children: categoria.descricao }), _jsx(Td, { children: categoria.dataCriacao }), _jsx(Td, { children: _jsxs(Flex, { gap: 2, children: [_jsx(Button, { size: "sm", colorScheme: "blue", leftIcon: _jsx(FiEdit2, {}), onClick: () => handleEditarCategoria(categoria), children: "Editar" }), _jsx(Button, { size: "sm", colorScheme: "red", leftIcon: _jsx(FiTrash2, {}), onClick: () => handleExcluirCategoria(categoria.id), children: "Excluir" })] }) })] }, categoria.id))) })] }) }) }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: categoriaEditando ? 'Editar Categoria' : 'Nova Categoria' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(Stack, { spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Nome" }), _jsx(Input, { value: novaCategoria.nome, onChange: (e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value }) })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Descri\u00E7\u00E3o" }), _jsx(Input, { value: novaCategoria.descricao, onChange: (e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value }) })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", onClick: categoriaEditando ? handleSalvarEdicao : handleAdicionarCategoria, children: categoriaEditando ? 'Salvar' : 'Adicionar' })] })] })] })] }));
}
