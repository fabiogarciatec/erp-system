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
  icon?: React.ElementType;
}

export function PageHeader({ title, subtitle, description, breadcrumbs, rightContent, icon: IconComponent }: PageHeaderProps) {
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
            separator={<ChevronRightIcon color="gray.500" />}
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink
                  as={Link}
                  to={breadcrumb.href}
                  color="gray.500"
                  _hover={{ color: 'blue.500' }}
                >
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}

        <Flex justify="space-between" align="center">
          <Box>
            <HStack spacing={4} align="center">
              {IconComponent && (
                <Icon
                  as={IconComponent}
                  boxSize={8}
                  color="blue.500"
                />
              )}
              <Box>
                <Heading
                  as="h1"
                  size="lg"
                  bgGradient={titleGradient}
                  bgClip="text"
                >
                  {title}
                </Heading>
                {subtitle && (
                  <Text color={subtitleColor} mt={1}>
                    {subtitle}
                  </Text>
                )}
                {description && (
                  <Text mt={2} color="gray.500" fontSize="sm">
                    {description}
                  </Text>
                )}
              </Box>
            </HStack>
          </Box>
          {rightContent && (
            <Box>{rightContent}</Box>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
