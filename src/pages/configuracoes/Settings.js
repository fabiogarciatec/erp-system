import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Text, VStack, SimpleGrid, Card, CardBody, Icon, useColorModeValue, } from '@chakra-ui/react';
import { FiUser, FiUsers, FiSettings, FiLink, FiBell, FiShield } from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
const settingCards = [
    {
        title: 'Perfil',
        description: 'Gerencie suas informações pessoais e preferências',
        icon: FiUser,
        href: '/configuracoes/perfil',
    },
    {
        title: 'Empresa',
        description: 'Gerencie informações da empresa',
        icon: FiUsers,
        href: '/configuracoes/empresa',
    },
    {
        title: 'Geral',
        description: 'Configurações gerais do sistema',
        icon: FiSettings,
        href: '/configuracoes/gerais',
    },
    {
        title: 'Usuários',
        description: 'Gerencie usuários e permissões',
        icon: FiUsers,
        href: '/configuracoes/usuarios',
    },
    {
        title: 'Segurança',
        description: 'Configure opções de segurança e autenticação',
        icon: FiShield,
        href: '/configuracoes/seguranca',
    },
    {
        title: 'Notificações',
        description: 'Configure suas preferências de notificação',
        icon: FiBell,
        href: '/configuracoes/notificacoes',
    },
    {
        title: 'Integrações',
        description: 'Gerencie integrações com outros sistemas',
        icon: FiLink,
        href: '/configuracoes/integracoes',
    },
];
export function Settings() {
    const location = useLocation();
    const isRoot = location.pathname === '/configuracoes';
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    if (!isRoot) {
        return _jsx(Outlet, {});
    }
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Configura\u00E7\u00F5es", subtitle: "Gerencie todas as configura\u00E7\u00F5es do sistema", icon: FiSettings, breadcrumbs: [
                    { label: 'Dashboard', href: '/' },
                    { label: 'Configurações', href: '/configuracoes' },
                ] }), _jsx(Container, { maxW: "container.xl", mt: 6, children: _jsx(SimpleGrid, { columns: { base: 1, md: 2, lg: 3 }, spacing: 6, children: settingCards.map((card) => (_jsx(Link, { to: card.href, children: _jsx(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, _hover: {
                                transform: 'translateY(-2px)',
                                shadow: 'md',
                                borderColor: 'blue.500',
                            }, transition: "all 0.2s", cursor: "pointer", children: _jsx(CardBody, { children: _jsxs(VStack, { align: "start", spacing: 4, children: [_jsx(Icon, { as: card.icon, boxSize: 6, color: "blue.500" }), _jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", fontSize: "lg", children: card.title }), _jsx(Text, { color: "gray.500", fontSize: "sm", children: card.description })] })] }) }) }) }, card.title))) }) })] }));
}
