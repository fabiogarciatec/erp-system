import { ReactNode, useState } from 'react';
import {
  Flex,
  Text,
  Icon,
  Link,
  FlexProps,
  Collapse,
  useColorModeValue,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

interface NavItemProps extends FlexProps {
  icon?: IconType;
  children: ReactNode;
  href?: string;
  subItems?: Array<{
    label: string;
    href: string;
  }>;
}

export function SidebarNavItem({ icon, children, href, subItems, ...rest }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = href ? location.pathname === href : false;
  const hasSubItems = subItems && subItems.length > 0;

  const color = useColorModeValue('gray.600', 'gray.400');
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const handleToggle = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    }
  };

  const NavContent = (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor={hasSubItems ? 'pointer' : 'default'}
      bg={isActive ? hoverBg : 'transparent'}
      color={isActive ? activeColor : color}
      _hover={{
        bg: hoverBg,
        color: activeColor,
      }}
      onClick={handleToggle}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          _groupHover={{
            color: activeColor,
          }}
        />
      )}
      <Text flex="1">{children}</Text>
      {hasSubItems && (
        <Icon
          as={FiChevronDown}
          transition="all .25s ease-in-out"
          transform={isOpen ? 'rotate(180deg)' : ''}
          w={6}
          h={6}
        />
      )}
    </Flex>
  );

  return (
    <>
      {href && !hasSubItems ? (
        <Link
          as={RouterLink}
          to={href}
          style={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none' }}
        >
          {NavContent}
        </Link>
      ) : (
        NavContent
      )}

      {hasSubItems && (
        <Collapse in={isOpen} animateOpacity>
          {subItems.map((subItem) => (
            <Link
              key={subItem.href}
              as={RouterLink}
              to={subItem.href}
              style={{ textDecoration: 'none' }}
              _focus={{ boxShadow: 'none' }}
            >
              <Flex
                align="center"
                pl="12"
                py="2"
                color={location.pathname === subItem.href ? activeColor : color}
                _hover={{
                  color: activeColor,
                }}
              >
                <Text>{subItem.label}</Text>
              </Flex>
            </Link>
          ))}
        </Collapse>
      )}
    </>
  );
}
