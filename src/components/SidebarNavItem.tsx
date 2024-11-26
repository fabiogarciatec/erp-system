import {
  Flex,
  Icon,
  Link,
  FlexProps,
  Text,
  Box,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface NavItemProps extends FlexProps {
  icon?: IconType;
  path: string;
  children: React.ReactNode;
  isActive?: boolean;
  isSubItem?: boolean;
}

interface SidebarItemProps {
  item: {
    name: string;
    path: string;
    icon: IconType;
    subItems?: Array<{
      name: string;
      path: string;
      icon?: IconType;
    }>;
  };
}

const NavItem = ({ icon, path, children, isActive, isSubItem, ...rest }: NavItemProps) => {
  return (
    <Link
      as={RouterLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx={isSubItem ? "4" : "0"}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'blue.400' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

export function SidebarNavItem({ item }: SidebarItemProps) {
  const location = useLocation();
  const { isOpen, onToggle } = useDisclosure();
  const isActive = location.pathname === item.path;
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isParentOfActive = hasSubItems && item.subItems?.some(
    subItem => location.pathname === subItem.path
  );

  if (hasSubItems) {
    return (
      <Box>
        <Flex
          align="center"
          p="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isParentOfActive ? 'blue.400' : 'transparent'}
          color={isParentOfActive ? 'white' : 'inherit'}
          onClick={onToggle}
          _hover={{
            bg: 'blue.400',
            color: 'white',
          }}
        >
          <Icon
            mr="4"
            fontSize="16"
            as={item.icon}
          />
          <Text flex="1">{item.name}</Text>
          <Icon
            fontSize="16"
            as={isOpen ? FiChevronDown : FiChevronRight}
          />
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <Box pl="4">
            {item.subItems.map((subItem) => (
              <NavItem
                key={subItem.path}
                icon={subItem.icon}
                path={subItem.path}
                isActive={location.pathname === subItem.path}
                isSubItem
              >
                {subItem.name}
              </NavItem>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  return (
    <NavItem
      icon={item.icon}
      path={item.path}
      isActive={isActive}
    >
      {item.name}
    </NavItem>
  );
}
