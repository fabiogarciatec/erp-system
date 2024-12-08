import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Flex, Icon, Link, Text, useColorModeValue, Collapse } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
export function SidebarNavItem({ icon, children, href, subItems, onClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isActive = href
        ? location.pathname === href
        : subItems?.some(item => location.pathname === item.href) || false;
    const hasSubItems = subItems && subItems.length > 0;
    useEffect(() => {
        if (hasSubItems && subItems.some(item => location.pathname === item.href)) {
            setIsOpen(true);
        }
    }, [location.pathname, hasSubItems, subItems]);
    const color = useColorModeValue('gray.600', 'gray.400');
    const activeColor = useColorModeValue('blue.600', 'blue.300');
    const activeBg = useColorModeValue('blue.50', 'blue.900');
    const hoverBg = useColorModeValue('blue.50', 'gray.700');
    const handleClick = () => {
        if (hasSubItems) {
            setIsOpen(!isOpen);
        }
        else if (onClick) {
            onClick();
        }
    };
    const NavContent = (_jsxs(Flex, { align: "center", p: "4", mx: "4", borderRadius: "lg", role: "group", cursor: "pointer", bg: isActive ? activeBg : 'transparent', color: isActive ? activeColor : color, _hover: {
            bg: isActive ? activeBg : hoverBg,
            color: activeColor,
        }, onClick: handleClick, children: [icon && (_jsx(Icon, { mr: "4", fontSize: "16", as: icon, color: isActive ? activeColor : color, _groupHover: {
                    color: activeColor,
                } })), _jsx(Text, { flex: "1", fontWeight: isActive ? "semibold" : "normal", children: children }), hasSubItems && (_jsx(Icon, { as: FiChevronDown, transition: "all .25s ease-in-out", transform: isOpen ? 'rotate(180deg)' : '', w: 6, h: 6 }))] }));
    return (_jsxs(_Fragment, { children: [href && !hasSubItems ? (_jsx(Link, { as: RouterLink, to: href, style: { textDecoration: 'none' }, _focus: { boxShadow: 'none' }, children: NavContent })) : (NavContent), hasSubItems && (_jsx(Collapse, { in: isOpen, animateOpacity: true, children: subItems.map((subItem) => {
                    const isSubItemActive = location.pathname === subItem.href;
                    return (_jsx(Link, { as: RouterLink, to: subItem.href, style: { textDecoration: 'none' }, _focus: { boxShadow: 'none' }, children: _jsxs(Flex, { align: "center", py: "2", px: "12", mx: "4", borderRadius: "lg", role: "group", cursor: "pointer", color: isSubItemActive ? activeColor : color, bg: isSubItemActive ? activeBg : 'transparent', _hover: {
                                bg: isSubItemActive ? activeBg : hoverBg,
                                color: activeColor,
                            }, onClick: onClick, children: [subItem.icon && (_jsx(Icon, { mr: "3", fontSize: "14", as: subItem.icon, color: isSubItemActive ? activeColor : color, _groupHover: {
                                        color: activeColor,
                                    } })), _jsx(Text, { fontSize: "sm", fontWeight: isSubItemActive ? "semibold" : "normal", children: subItem.label })] }) }, subItem.href));
                }) }))] }));
}
