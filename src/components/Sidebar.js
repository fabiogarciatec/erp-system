import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Collapse, Flex, Icon, Stack, Text, useColorModeValue, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, useMediaQuery, } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { FiHome, FiTrendingUp, FiSettings, FiUsers, FiDollarSign, FiPackage, FiTool, FiRefreshCw, FiBarChart2, FiLogOut, FiDatabase, FiChevronDown, FiBox, FiShoppingCart, FiPieChart, FiUser, FiShield, FiBell, FiLink, FiFileText, FiClipboard, FiFile, FiCreditCard, FiTruck, FiCalendar, FiTag, FiGrid, FiPercent, } from 'react-icons/fi';
function NavItem({ icon, children, subItems, ...rest }) {
    // 1. Hooks de Context
    const { onClose } = useSidebar();
    // 2. Hooks de Estado e Location
    const { isOpen, onToggle } = useDisclosure();
    const location = useLocation();
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    // 3. Hooks de Cor
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const activeTextColor = 'blue.500';
    const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
    const hoverTextColor = useColorModeValue('gray.900', 'white');
    const activeBgColor = useColorModeValue('blue.50', 'rgba(66, 153, 225, 0.1)');
    // 4. Funções utilitárias
    const isActive = (path) => location.pathname === path;
    const hasActiveSubItem = subItems?.some(item => isActive(item.href));
    return (_jsxs(_Fragment, { children: [_jsxs(Flex, { align: "center", p: "3", mx: "1", borderRadius: "lg", role: "group", cursor: "pointer", onClick: subItems ? onToggle : undefined, bg: hasActiveSubItem ? activeBgColor : 'transparent', color: hasActiveSubItem ? activeTextColor : textColor, _hover: {
                    bg: hoverBgColor,
                    color: hoverTextColor,
                }, transition: "all 0.2s", ...rest, children: [icon && (_jsx(Icon, { mr: "3", fontSize: "16", as: icon, color: hasActiveSubItem ? activeTextColor : textColor, _groupHover: {
                            color: hoverTextColor,
                        } })), _jsx(Text, { flex: "1", fontSize: "sm", children: children }), subItems && (_jsx(Icon, { as: FiChevronDown, transition: "all .25s ease-in-out", transform: isOpen ? "rotate(180deg)" : "", w: 4, h: 4 }))] }), subItems && (_jsx(Collapse, { in: isOpen, animateOpacity: true, children: _jsx(Stack, { pl: "8", mt: "1", mb: "2", children: subItems.map((item) => (_jsx(Link, { to: item.href, style: { textDecoration: 'none' }, onClick: isMobile ? onClose : undefined, children: _jsxs(Flex, { align: "center", p: "2", pl: "3", borderRadius: "lg", role: "group", cursor: "pointer", bg: isActive(item.href) ? activeBgColor : 'transparent', color: isActive(item.href) ? activeTextColor : textColor, _hover: {
                                bg: hoverBgColor,
                                color: hoverTextColor,
                            }, transition: "all 0.2s", children: [item.icon && (_jsx(Icon, { mr: "3", fontSize: "14", as: item.icon, color: isActive(item.href) ? activeTextColor : textColor, _groupHover: {
                                        color: hoverTextColor,
                                    } })), _jsx(Text, { fontSize: "sm", children: item.label })] }) }, item.href))) }) }))] }));
}
function Sidebar(props) {
    // 1. Hooks de Context
    const { isOpen, onClose } = useSidebar();
    const { logout, user } = useAuth();
    // Se não houver usuário logado, não renderiza o sidebar
    if (!user)
        return null;
    // 2. Hooks de Location e Media Query
    const location = useLocation();
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    // 3. Hooks de Cor
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const logoutBg = useColorModeValue('red.50', 'rgba(254, 178, 178, 0.12)');
    const logoutColor = useColorModeValue('red.500', 'red.300');
    const logoutHoverBg = useColorModeValue('red.100', 'rgba(254, 178, 178, 0.24)');
    const logoutHoverColor = useColorModeValue('red.500', 'red.300');
    const scrollTrackBg = useColorModeValue('gray.100', 'gray.700');
    const closeButtonHoverBg = useColorModeValue('gray.100', 'gray.700');
    // 4. Dados do Menu
    const menuData = {
        cadastros: [
            { label: 'Clientes', href: '/cadastros/clientes', icon: FiUsers },
            { label: 'Produtos', href: '/cadastros/produtos', icon: FiBox },
            { label: 'Fornecedores', href: '/cadastros/fornecedores', icon: FiTruck },
            { label: 'Categorias', href: '/cadastros/categorias', icon: FiGrid },
            { label: 'Serviços', href: '/cadastros/servicos', icon: FiTool },
            { label: 'Marcas', href: '/cadastros/marcas', icon: FiTag },
            { label: 'Unidades', href: '/cadastros/unidades', icon: FiBox }
        ],
        operacoes: [
            { label: 'Vendas', href: '/operacoes/vendas', icon: FiShoppingCart },
            { label: 'Orçamentos', href: '/operacoes/orcamentos', icon: FiFileText },
            { label: 'Pedidos', href: '/operacoes/pedidos', icon: FiClipboard },
            { label: 'Notas Fiscais', href: '/operacoes/notas-fiscais', icon: FiFile },
            { label: 'PDV', href: '/operacoes/pdv', icon: FiDollarSign },
            { label: 'Agendamentos', href: '/operacoes/agendamentos', icon: FiCalendar },
        ],
        financeiro: [
            { label: 'Contas a Receber', href: '/financeiro/contas-receber', icon: FiDollarSign },
            { label: 'Contas a Pagar', href: '/financeiro/contas-pagar', icon: FiCreditCard },
            { label: 'Fluxo de Caixa', href: '/financeiro/fluxo-caixa', icon: FiTrendingUp },
            { label: 'Bancos', href: '/financeiro/bancos', icon: FiDatabase },
            { label: 'Conciliação', href: '/financeiro/conciliacao', icon: FiRefreshCw },
            { label: 'Centro de Custos', href: '/financeiro/centro-custos', icon: FiGrid },
        ],
        estoque: [
            { label: 'Movimentações', href: '/estoque/movimentacoes', icon: FiPackage },
            { label: 'Ajustes', href: '/estoque/ajustes', icon: FiTool },
            { label: 'Transferências', href: '/estoque/transferencias', icon: FiRefreshCw },
            { label: 'Inventário', href: '/estoque/inventario', icon: FiClipboard },
            { label: 'Compras', href: '/estoque/compras', icon: FiShoppingCart },
        ],
        relatorios: [
            { label: 'Vendas', href: '/relatorios/vendas', icon: FiBarChart2 },
            { label: 'Financeiro', href: '/relatorios/financeiro', icon: FiPieChart },
            { label: 'Estoque', href: '/relatorios/estoque', icon: FiBox },
            { label: 'Clientes', href: '/relatorios/clientes', icon: FiUsers },
            { label: 'Comissões', href: '/relatorios/comissoes', icon: FiPercent },
            { label: 'DRE', href: '/relatorios/dre', icon: FiTrendingUp },
        ],
        configuracoes: [
            { label: 'Perfil', href: '/configuracoes/perfil', icon: FiUser },
            { label: 'Empresa', href: '/configuracoes/empresa', icon: FiGrid },
            { label: 'Geral', href: '/configuracoes/gerais', icon: FiTool },
            { label: 'Usuários', href: '/configuracoes/usuarios', icon: FiUsers },
            { label: 'Segurança', href: '/configuracoes/seguranca', icon: FiShield },
            { label: 'Notificações', href: '/configuracoes/notificacoes', icon: FiBell },
            { label: 'Integrações', href: '/configuracoes/integracoes', icon: FiLink },
            { label: 'Backup', href: '/configuracoes/backup', icon: FiRefreshCw },
            { label: 'Permissões', href: '/configuracoes/permissoes', icon: FiShield },
        ]
    };
    const sidebarConfig = [
        { label: 'Dashboard', icon: FiHome, href: '/dashboard' },
        { label: 'Cadastros', icon: FiDatabase, subItems: menuData.cadastros },
        { label: 'Operações', icon: FiShoppingCart, subItems: menuData.operacoes },
        { label: 'Financeiro', icon: FiDollarSign, subItems: menuData.financeiro },
        { label: 'Estoque', icon: FiPackage, subItems: menuData.estoque },
        { label: 'Relatórios', icon: FiBarChart2, subItems: menuData.relatorios },
        { label: 'Configurações', icon: FiSettings, subItems: menuData.configuracoes },
    ];
    // 5. Componente do Conteúdo do Sidebar
    const SidebarContent = (_jsxs(Box, { as: "nav", height: "100vh", width: { base: "full", md: "240px" }, bg: bgColor, borderRight: "1px", borderRightColor: borderColor, position: "relative", overflowY: "auto", css: {
            '&::-webkit-scrollbar': {
                width: '6px',
                background: 'transparent',
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                background: 'transparent',
                borderRadius: '24px',
                transition: 'background 0.2s',
            },
            '&:hover::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 0, 0, 0.2)',
            },
            '&:hover::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(0, 0, 0, 0.3)',
            },
        }, ...props, children: [_jsx(Flex, { h: "20", alignItems: "center", mx: "8", justifyContent: "space-between", children: _jsx(Logo, {}) }), _jsx(Box, { flex: "1", overflowY: "auto", px: "4", children: _jsx(Stack, { spacing: "1", children: sidebarConfig.map((item) => {
                        if (item.subItems) {
                            return (_jsx(NavItem, { icon: item.icon, subItems: item.subItems, children: item.label }, item.label));
                        }
                        return (_jsx(Link, { to: item.href, style: { textDecoration: 'none' }, onClick: isMobile ? onClose : undefined, children: _jsx(NavItem, { icon: item.icon, children: item.label }) }, item.href));
                    }) }) }), _jsx(Box, { p: "4", borderTop: "1px", borderTopColor: borderColor, children: _jsx(Button, { onClick: logout, variant: "ghost", width: "full", display: "flex", alignItems: "center", justifyContent: "center", bg: logoutBg, color: logoutColor, _hover: {
                        bg: logoutHoverBg,
                        color: logoutHoverColor,
                    }, leftIcon: _jsx(FiLogOut, {}), children: "Sair" }) })] }));
    // 6. Renderização condicional baseada no dispositivo
    if (isMobile) {
        return (_jsxs(Drawer, { isOpen: isOpen, placement: "left", onClose: onClose, returnFocusOnClose: false, children: [_jsx(DrawerOverlay, {}), _jsxs(DrawerContent, { maxW: "240px", children: [_jsx(DrawerCloseButton, { size: "lg", color: textColor, bg: bgColor, _hover: { bg: closeButtonHoverBg }, position: "absolute", right: "-10px", top: "2", zIndex: 2000, borderRadius: "full", boxShadow: "md" }), _jsx(DrawerBody, { padding: 0, children: SidebarContent })] })] }));
    }
    return (_jsx(Box, { display: { base: "none", md: "block" }, w: "240px", position: "fixed", left: 0, top: 0, h: "full", zIndex: 20, children: SidebarContent }));
}
export default Sidebar;
