import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Text, VStack, SimpleGrid, Card, CardBody, Icon, useColorModeValue, } from '@chakra-ui/react';
import { FiUser, FiUsers, FiSettings, FiDatabase, FiLink, FiBell, FiShield } from 'react-icons/fi';
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
    {
        title: 'Backup',
        description: 'Configure e gerencie backups do sistema',
        icon: FiDatabase,
        href: '/configuracoes/backup',
    },
];
export function Settings() {
    const location = useLocation();
    const cardBg = useColorModeValue('white', 'gray.700');
    const isRoot = location.pathname === '/configuracoes' || location.pathname === '/configuracoes/';
    if (!isRoot) {
        return _jsx(Outlet, {});
    }
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Configura\u00E7\u00F5es", subtitle: "Gerencie as configura\u00E7\u00F5es do sistema", breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' }
                ] }), _jsx(Box, { mt: "154px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto", children: _jsx(Container, { maxW: "container.xl", py: 8, children: _jsx(SimpleGrid, { columns: { base: 1, md: 2, lg: 3 }, spacing: 6, mt: 6, children: settingCards.map((card) => (_jsx(Card, { as: Link, to: card.href, _hover: { transform: 'translateY(-2px)', shadow: 'lg' }, transition: "all 0.2s", bg: cardBg, children: _jsx(CardBody, { children: _jsxs(VStack, { align: "start", spacing: 4, children: [_jsx(Icon, { as: card.icon, boxSize: 6, color: "blue.500" }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", children: card.title }), _jsx(Text, { color: "gray.500", fontSize: "sm", children: card.description })] })] }) }) }, card.href))) }) }) }) })] }));
}
export default Settings;
