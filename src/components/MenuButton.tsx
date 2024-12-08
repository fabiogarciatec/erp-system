import { IconButton, useMediaQuery } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';

interface MenuButtonProps {}

export function MenuButton(props: MenuButtonProps) {
  const { onToggle } = useSidebar();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  if (!isMobile) return null;

  return (
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      onClick={onToggle}
      variant="ghost"
      aria-label="Abrir menu"
      icon={<FiMenu size={24} />}
      size="lg"
      _hover={{ bg: 'transparent' }}
      {...props}
    />
  );
}
