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
import { ChevronRightIcon } from '@chakra-ui/icons'

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
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const titleGradient = useColorModeValue(
    'linear(to-r, blue.400, blue.600)',
    'linear(to-r, blue.200, blue.400)'
  )
  const subtitleColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      mb={6}
      py={2}
      mt="-10px"
      boxShadow="sm"
    >
      <Box px={8}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb
            mb={2}
            fontSize="sm"
            color={subtitleColor}
            separator={<ChevronRightIcon color={subtitleColor} />}
          >
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbs.length - 1}>
                {item.href ? (
                  <BreadcrumbLink as={Link} to={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <Text>{item.label}</Text>
                )}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}

        <Heading 
          size="lg" 
          mb={subtitle ? 1 : 0}
          bgGradient={titleGradient}
          bgClip="text"
          letterSpacing="tight"
        >
          {title}
        </Heading>
        
        {subtitle && (
          <Text 
            color={subtitleColor}
            fontSize="md"
            fontWeight="medium"
          >
            {subtitle}
          </Text>
        )}
      </Box>
    </Box>
  )
}
