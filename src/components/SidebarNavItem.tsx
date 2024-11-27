import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface SidebarNavItemProps {
  icon: IconType;
  children: string;
  href: string;
}

export function SidebarNavItem({ icon, children, href }: SidebarNavItemProps) {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <Link
      as={RouterLink}
      to={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'gray.100' : 'transparent'}
        color={isActive ? 'gray.900' : 'gray.600'}
        _hover={{
          bg: 'gray.100',
          color: 'gray.900',
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'gray.900',
            }}
            as={icon}
          />
        )}
        <Text>{children}</Text>
      </Flex>
    </Link>
  );
}
