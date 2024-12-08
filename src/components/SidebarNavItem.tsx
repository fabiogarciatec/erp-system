import { Flex, Icon, Link, Text, useColorModeValue, Collapse } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiChevronDown } from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SubNavItem {
  label: string;
  href: string;
  icon?: IconType;
}

interface NavItemProps {
  icon?: IconType;
  children: React.ReactNode;
  href?: string;
  subItems?: SubNavItem[];
  onClick?: () => void;
}

export function SidebarNavItem({ icon, children, href, subItems, onClick }: NavItemProps) {
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
    } else if (onClick) {
      onClick();
    }
  };

  const NavContent = (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : color}
      _hover={{
        bg: isActive ? activeBg : hoverBg,
        color: activeColor,
      }}
      onClick={handleClick}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? activeColor : color}
          _groupHover={{
            color: activeColor,
          }}
        />
      )}
      <Text flex="1" fontWeight={isActive ? "semibold" : "normal"}>{children}</Text>
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
          {subItems.map((subItem) => {
            const isSubItemActive = location.pathname === subItem.href;
            
            return (
              <Link
                key={subItem.href}
                as={RouterLink}
                to={subItem.href}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Flex
                  align="center"
                  py="2"
                  px="12"
                  mx="4"
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                  color={isSubItemActive ? activeColor : color}
                  bg={isSubItemActive ? activeBg : 'transparent'}
                  _hover={{
                    bg: isSubItemActive ? activeBg : hoverBg,
                    color: activeColor,
                  }}
                  onClick={onClick}
                >
                  {subItem.icon && (
                    <Icon
                      mr="3"
                      fontSize="14"
                      as={subItem.icon}
                      color={isSubItemActive ? activeColor : color}
                      _groupHover={{
                        color: activeColor,
                      }}
                    />
                  )}
                  <Text 
                    fontSize="sm" 
                    fontWeight={isSubItemActive ? "semibold" : "normal"}
                  >
                    {subItem.label}
                  </Text>
                </Flex>
              </Link>
            );
          })}
        </Collapse>
      )}
    </>
  );
}
