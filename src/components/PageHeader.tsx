import {
  Box,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{
    label: string
    href: string
  }>
}

export function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      position="relative"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      w="full"
      left={0}
      right={0}
      marginLeft="-16px"
      marginRight="-16px"
    >
      <Box px={16} py={8}>
        {breadcrumbs && (
          <Breadcrumb fontSize="sm" color="gray.500" mb={3}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbs.length - 1}>
                <BreadcrumbLink as={Link} to={item.href}>
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
        <Flex direction="column">
          <Heading 
            size="lg" 
            fontWeight="bold" 
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            {title}
          </Heading>
          {subtitle && (
            <Text mt={2} color="gray.500" fontSize="md">
              {subtitle}
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
