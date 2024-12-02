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
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const subtitleColor = useColorModeValue('gray.600', 'gray.400')
  const breadcrumbColor = useColorModeValue('gray.500', 'gray.400')
  const separatorColor = useColorModeValue('gray.300', 'gray.600')

  return (
    <>
      <Box
        as="header"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        mb={8}
        py={4}
        px={0}
      >
        <Box maxW="7xl" mx="auto" px={[4, 6, 8]}>
          <Flex direction="column">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb
                mb={2}
                fontSize="sm"
                separator={
                  <Icon
                    as={FiChevronRight}
                    color={separatorColor}
                    fontSize="1em"
                    mt={1}
                  />
                }
              >
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItem
                    key={index}
                    isCurrentPage={index === breadcrumbs.length - 1}
                  >
                    <BreadcrumbLink
                      as={Link}
                      to={item.href}
                      color={breadcrumbColor}
                      _hover={{ color: 'blue.500', textDecoration: 'none' }}
                    >
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            )}

            <HStack spacing={4} justify="space-between" align="flex-start">
              <Box flex="1">
                <Box>
                  <Heading
                    as="h1"
                    fontSize={{ base: '2xl', sm: '3xl' }}
                    fontWeight="bold"
                    color="inherit"
                    mb={description ? 1 : 0}
                  >
                    {title}
                  </Heading>

                  {description && (
                    <Text color={subtitleColor} mt={1}>
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
