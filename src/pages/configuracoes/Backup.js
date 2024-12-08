import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Divider, HStack, Input, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, useToast, Progress, Card, CardBody, useColorModeValue, } from '@chakra-ui/react';
import { FiDownload, FiTrash2, FiUpload, FiDatabase } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
import { useState, useRef } from 'react';
const mockBackups = [
    {
        id: 1,
        date: '2024-01-15 10:30',
        size: '2.5 MB',
        status: 'Concluído',
        type: 'Manual',
        filename: 'backup_20240115_103000.zip'
    },
    {
        id: 2,
        date: '2024-01-14 15:45',
        size: '2.3 MB',
        status: 'Concluído',
        type: 'Automático',
        filename: 'backup_20240114_154500.zip'
    },
    {
        id: 3,
        date: '2024-01-13 20:15',
        size: '2.4 MB',
        status: 'Concluído',
        type: 'Manual',
        filename: 'backup_20240113_201500.zip'
    }
];
export function Backup() {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [isBackupInProgress, setIsBackupInProgress] = useState(false);
    const [isRestoreInProgress, setIsRestoreInProgress] = useState(false);
    const [backupProgress, setBackupProgress] = useState(0);
    const [backups, setBackups] = useState(mockBackups);
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const handleBackup = async () => {
        setIsBackupInProgress(true);
        setBackupProgress(0);
        // Simulando progresso
        const interval = setInterval(() => {
            setBackupProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsBackupInProgress(false);
                    // Adicionar novo backup à lista
                    const newBackup = {
                        id: Math.max(...backups.map(b => b.id)) + 1,
                        date: new Date().toLocaleString(),
                        size: '2.5 MB',
                        status: 'Concluído',
                        type: 'Manual',
                        filename: `backup_${new Date().toISOString().replace(/[:.]/g, '')}.zip`
                    };
                    setBackups([newBackup, ...backups]);
                    toast({
                        title: 'Backup concluído',
                        description: 'O backup foi realizado com sucesso.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    return 100;
                }
                return prev + 10;
            });
        }, 500);
    };
    const handleRestore = (file) => {
        setIsRestoreInProgress(true);
        // Simulando restauração
        setTimeout(() => {
            setIsRestoreInProgress(false);
            toast({
                title: 'Restauração concluída',
                description: 'O sistema foi restaurado com sucesso.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }, 3000);
    };
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            handleRestore(file);
        }
    };
    const handleDelete = (id) => {
        setBackups(backups.filter(backup => backup.id !== id));
        toast({
            title: 'Backup excluído',
            description: 'O backup foi excluído com sucesso.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Backup do Sistema", subtitle: "Gerencie os backups e restaura\u00E7\u00F5es do sistema", icon: FiDatabase, breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Backup', href: '/configuracoes/backup' }
                ] }), _jsx(Box, { display: "flex", mt: "-10px", px: 8, flexDirection: { base: "column", xl: "row" }, w: "86vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { flex: "1", spacing: 6, align: "stretch", width: "100%", children: [_jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 6, children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", children: "Gerenciamento de Backup" }), _jsx(Divider, {}), _jsxs(HStack, { spacing: 4, children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "blue", onClick: handleBackup, isLoading: isBackupInProgress, loadingText: "Realizando backup...", size: "lg", children: "Realizar Backup" }), _jsx(Button, { leftIcon: _jsx(FiUpload, {}), colorScheme: "green", onClick: () => fileInputRef.current?.click(), isLoading: isRestoreInProgress, loadingText: "Restaurando...", size: "lg", children: "Restaurar Backup" }), _jsx(Input, { type: "file", ref: fileInputRef, display: "none", onChange: handleFileSelect, accept: ".zip" })] }), isBackupInProgress && (_jsxs(Box, { children: [_jsx(Text, { mb: 2, children: "Progresso do backup:" }), _jsx(Progress, { value: backupProgress, size: "sm", colorScheme: "blue", rounded: "md" })] }))] }) }) }), _jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 6, children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", children: "Hist\u00F3rico de Backups" }), _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Data" }), _jsx(Th, { children: "Tamanho" }), _jsx(Th, { children: "Tipo" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: backups.map((backup) => (_jsxs(Tr, { children: [_jsx(Td, { children: backup.date }), _jsx(Td, { children: backup.size }), _jsx(Td, { children: backup.type }), _jsx(Td, { children: backup.status }), _jsx(Td, { children: _jsxs(HStack, { spacing: 2, children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), size: "sm", colorScheme: "blue", variant: "ghost", children: "Download" }), _jsx(Button, { leftIcon: _jsx(FiTrash2, {}), size: "sm", colorScheme: "red", variant: "ghost", onClick: () => handleDelete(backup.id), children: "Excluir" })] }) })] }, backup.id))) })] })] }) }) })] }) })] }));
}
