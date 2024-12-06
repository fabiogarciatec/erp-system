import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, SimpleGrid, Card, CardHeader, CardBody, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, useColorModeValue, Icon, HStack, VStack, } from '@chakra-ui/react';
import { FiUsers, FiShoppingBag, FiTruck, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
// Dados de vendas mensais
const salesData = [
    { month: 'Jan', value: 45670, growth: 23.36 },
    { month: 'Fev', value: 52450, growth: 14.85 },
    { month: 'Mar', value: 48320, growth: -7.87 },
    { month: 'Abr', value: 51280, growth: 6.13 },
    { month: 'Mai', value: 53420, growth: 4.17 },
    { month: 'Jun', value: 56800, growth: 6.33 }
];
const SalesCard = ({ month, value, growth }) => {
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    return (_jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: { base: 3, md: 4 }, children: _jsxs(VStack, { spacing: 1, align: "stretch", children: [_jsx(Text, { fontSize: "sm", color: textColor, children: month }), _jsxs(Text, { fontSize: "lg", fontWeight: "bold", children: ["R$ ", value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })] }), _jsxs(HStack, { spacing: 1, children: [_jsx(Icon, { as: growth >= 0 ? FiTrendingUp : FiTrendingDown, color: growth >= 0 ? 'green.500' : 'red.500' }), _jsxs(Text, { fontSize: "sm", color: growth >= 0 ? 'green.500' : 'red.500', children: [Math.abs(growth).toFixed(2), "%"] })] })] }) }));
};
const StatCard = ({ label, value, icon, percentage, isIncrease }) => {
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    return (_jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: { base: 4, md: 5 }, children: _jsxs(VStack, { spacing: 2, align: "stretch", children: [_jsxs(HStack, { justify: "space-between", children: [_jsx(Icon, { as: icon, boxSize: 6, color: "blue.500" }), _jsxs(Badge, { colorScheme: isIncrease ? 'green' : 'red', variant: "subtle", rounded: "full", px: 2, children: [isIncrease ? '+' : '-', percentage] })] }), _jsx(Text, { fontSize: { base: "xl", md: "2xl" }, fontWeight: "bold", children: value }), _jsx(Text, { fontSize: "sm", color: textColor, children: label })] }) }));
};
export default function Dashboard() {
    const { user } = useAuth();
    const textColor = useColorModeValue('gray.600', 'gray.400');
    // Stats cards data
    const stats = [
        {
            label: 'Clientes',
            value: '1,254',
            icon: FiUsers,
            percentage: '12.5%',
            isIncrease: true
        },
        {
            label: 'Vendas',
            value: 'R$ 86,420',
            icon: FiShoppingBag,
            percentage: '8.2%',
            isIncrease: true
        },
        {
            label: 'Pedidos',
            value: '324',
            icon: FiTruck,
            percentage: '3.1%',
            isIncrease: false
        }
    ];
    return (_jsx(Box, { w: "100%", children: _jsxs(Box, { pt: { base: "10px", md: "15px" }, position: "relative", w: "100%", children: [_jsx(PageHeader, { title: "Dashboard", subtitle: "Vis\u00E3o geral do seu neg\u00F3cio", breadcrumbs: [
                        { label: 'Dashboard', href: '/dashboard' }
                    ] }), _jsx(Box, { px: { base: 2, sm: 4, md: 6 }, pb: { base: 6, md: 8 }, w: "100%", overflowX: "hidden", children: _jsxs(Box, { maxW: "1600px", mx: "auto", children: [_jsx(SimpleGrid, { columns: { base: 1, sm: 2, md: 3 }, spacing: { base: 2, sm: 3, md: 4 }, mb: { base: 4, md: 6 }, w: "100%", children: stats.map((stat, index) => (_jsx(StatCard, { ...stat }, index))) }), _jsxs(Box, { mb: { base: 4, md: 6 }, children: [_jsx(Heading, { size: "md", mb: { base: 2, md: 3 }, children: "Vendas Mensais" }), _jsx(SimpleGrid, { columns: { base: 1, sm: 2, md: 3, lg: 6 }, spacing: { base: 2, sm: 3, md: 4 }, w: "100%", children: salesData.map((data, index) => (_jsx(SalesCard, { ...data }, index))) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Atividades Recentes" }) }), _jsx(CardBody, { children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "A\u00E7\u00E3o" }), _jsx(Th, { children: "Usu\u00E1rio" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Data" })] }) }), _jsxs(Tbody, { children: [_jsxs(Tr, { children: [_jsx(Td, { children: "Novo cliente cadastrado" }), _jsx(Td, { children: user?.email }), _jsx(Td, { children: _jsx(Badge, { colorScheme: "green", children: "Conclu\u00EDdo" }) }), _jsx(Td, { children: new Date().toLocaleDateString() })] }), _jsxs(Tr, { children: [_jsx(Td, { children: "Pedido atualizado" }), _jsx(Td, { children: user?.email }), _jsx(Td, { children: _jsx(Badge, { colorScheme: "blue", children: "Em andamento" }) }), _jsx(Td, { children: new Date().toLocaleDateString() })] })] })] }) })] })] }) })] }) }));
}
