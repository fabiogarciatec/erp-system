import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const SidebarContext = createContext<SidebarContextType>({} as SidebarContextType);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(!isOpen);
  const onClose = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, onToggle, onClose }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
