import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton, useMediaQuery } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';
export function MenuButton(props) {
    const { onToggle } = useSidebar();
    const [isMobile] = useMediaQuery("(max-width: 768px)");
    if (!isMobile)
        return null;
    return (_jsx(IconButton, { display: { base: 'flex', md: 'none' }, onClick: onToggle, variant: "ghost", "aria-label": "Abrir menu", icon: _jsx(FiMenu, { size: 24 }), size: "lg", _hover: { bg: 'transparent' }, ...props }));
}
