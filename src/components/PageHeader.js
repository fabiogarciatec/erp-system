import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Heading, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, useColorModeValue, HStack, Icon, } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
export function PageHeader({ title, subtitle, description, breadcrumbs, rightContent, icon: IconComponent }) {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const titleGradient = useColorModeValue('linear(to-r, blue.400, blue.600)', 'linear(to-r, blue.200, blue.400)');
    const subtitleColor = useColorModeValue('gray.600', 'gray.400');
    return (_jsx(Box, { as: "header", borderBottom: "1px", borderColor: borderColor, mb: 4, py: 3, bg: bg, boxShadow: "sm", width: "100%", children: _jsxs(Box, { px: { base: 4, md: 8 }, children: [breadcrumbs && breadcrumbs.length > 0 && (_jsx(Breadcrumb, { mb: 1.5, mt: 1, fontSize: "sm", separator: _jsx(ChevronRightIcon, { color: "gray.500" }), overflowX: "auto", whiteSpace: "nowrap", css: {
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }, children: breadcrumbs.map((item, index) => (_jsx(BreadcrumbItem, { children: _jsx(BreadcrumbLink, { as: Link, to: item.href, color: "gray.500", _hover: { color: "blue.500" }, children: item.label }) }, index))) })), _jsxs(Flex, { justifyContent: "space-between", alignItems: { base: "flex-start", md: "center" }, flexDirection: { base: "column", md: "row" }, gap: { base: 1.5, md: 0 }, children: [_jsxs(HStack, { spacing: 3, align: "flex-start", children: [IconComponent && (_jsx(Icon, { as: IconComponent, boxSize: 5, color: "blue.500" })), _jsxs(Box, { children: [_jsx(Heading, { as: "h1", size: { base: "sm", md: "md" }, bgGradient: titleGradient, bgClip: "text", lineHeight: "shorter", children: title }), subtitle && (_jsx(Text, { color: subtitleColor, mt: 0.5, fontSize: { base: "xs", md: "sm" }, children: subtitle })), description && (_jsx(Text, { color: "gray.500", mt: 1, fontSize: "xs", children: description }))] })] }), rightContent && (_jsx(Box, { mt: { base: 1.5, md: 0 }, children: rightContent }))] })] }) }));
}
