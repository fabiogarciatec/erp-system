import {
  Box,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, subtitle, description, breadcrumbs, rightContent }: PageHeaderProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const breadcrumbColor = useColorModeValue('gray.500', 'gray.400');
  const titleGradient = useColorModeValue(
    'linear(to-r, blue.400, blue.600)',
    'linear(to-r, blue.200, blue.400)'
  );
  const subtitleColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <>
      <Box
        position="fixed"
        top="56px"
        right={0}
        left="240px"
        height="4px"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        zIndex={2}
      />
      <Box 
        position="fixed"
        top="60px"
        right={0}
        left="240px"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        zIndex={2}
        h="90px"
        display="flex"
        alignItems="center"
        backdropFilter="blur(10px)"
        backgroundColor={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)')}
        boxShadow="sm"
      >
        <Box 
          w="100%"
          px={6}
        >
          <Flex direction="column" h="100%" justify="center">
            {breadcrumbs && (
              <Breadcrumb 
                fontSize="sm" 
                color={breadcrumbColor} 
                mb={1.5}
                spacing={2}
                separator={<Icon as={FiChevronRight} color={breadcrumbColor} />}
              >
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    as={Link} 
                    to="/"
                    _hover={{ color: 'blue.500', textDecoration: 'none' }}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbs.length - 1}>
                    <BreadcrumbLink 
                      as={Link} 
                      to={item.href}
                      _hover={{ color: 'blue.500', textDecoration: 'none' }}
                    >
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            )}
            
            <HStack justify="space-between" align="center" spacing={4}>
              <Box>
                <Box>
                  <Heading 
                    as="h1"
                    size="lg"
                    bgGradient={titleGradient}
                    bgClip="text"
                  >
                    {title}
                  </Heading>
                  {description && (
                    <Text 
                      color={subtitleColor} 
                      mt={1}
                    >
                      {description}
                    </Text>
                  )}
                  {subtitle && (
                    <Text 
                      color={subtitleColor} 
                      mt={0.5} 
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      {subtitle}
                    </Text>
                  )}
                </Box>
              </Box>
              {rightContent && (
                <Box>
                  {rightContent}
                </Box>
              )}
            </HStack>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
