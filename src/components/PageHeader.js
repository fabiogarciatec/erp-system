import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Heading, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue, } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
export function PageHeader({ title, subtitle, description, breadcrumbs, rightContent }) {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.100', 'gray.700');
    const titleGradient = useColorModeValue('linear(to-r, blue.400, blue.600)', 'linear(to-r, blue.200, blue.400)');
    const subtitleColor = useColorModeValue('gray.600', 'gray.400');
    return (_jsx(Box, { as: "header", bg: bgColor, borderBottom: "1px", borderColor: borderColor, mb: 6, py: 2, mt: "-10px", boxShadow: "sm", children: _jsxs(Box, { px: 8, children: [breadcrumbs && breadcrumbs.length > 0 && (_jsx(Breadcrumb, { mb: 2, fontSize: "sm", color: subtitleColor, separator: _jsx(ChevronRightIcon, { color: subtitleColor }), children: breadcrumbs.map((item, index) => (_jsx(BreadcrumbItem, { isCurrentPage: index === breadcrumbs.length - 1, children: item.href ? (_jsx(BreadcrumbLink, { as: Link, to: item.href, children: item.label })) : (_jsx(Text, { children: item.label })) }, index))) })), _jsx(Heading, { size: "lg", mb: subtitle ? 1 : 0, bgGradient: titleGradient, bgClip: "text", letterSpacing: "tight", children: title }), subtitle && (_jsx(Text, { color: subtitleColor, fontSize: "md", fontWeight: "medium", children: subtitle }))] }) }));
}
