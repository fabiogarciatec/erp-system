import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const SidebarContext = createContext({});
export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const onToggle = () => setIsOpen(!isOpen);
    const onClose = () => setIsOpen(false);
    return (_jsx(SidebarContext.Provider, { value: { isOpen, onToggle, onClose }, children: children }));
}
export const useSidebar = () => useContext(SidebarContext);
