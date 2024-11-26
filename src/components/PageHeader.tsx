import {
  Box,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
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
  return (
    <Box mb={4} bg="white" p={4} borderRadius="lg" shadow="sm">
      {breadcrumbs && (
        <Breadcrumb fontSize="sm" mb={2} color="gray.500">
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
        <Heading size="lg" fontWeight="bold" color="gray.700">
          {title}
        </Heading>
        {subtitle && (
          <Text mt={1} color="gray.500" fontSize="sm">
            {subtitle}
          </Text>
        )}
      </Flex>
    </Box>
  )
}
