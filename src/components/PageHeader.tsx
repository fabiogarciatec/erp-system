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
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const titleGradient = useColorModeValue(
    'linear(to-r, blue.400, blue.600)',
    'linear(to-r, blue.200, blue.400)'
  )
  const subtitleColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box
      as="header"
      borderBottom="1px"
      borderColor={borderColor}
      mb={4}
      py={3}
      bg={bg}
      boxShadow="sm"
      width="100%"
    >
      <Box px={{ base: 4, md: 8 }}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb
            mb={1.5}
            mt={1}
            fontSize="sm"
            separator={<ChevronRightIcon color="gray.500" />}
            overflowX="auto"
            whiteSpace="nowrap"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            {breadcrumbs.map((item, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink 
                  as={Link} 
                  to={item.href}
                  color="gray.500"
                  _hover={{ color: "blue.500" }}
                >
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}

        <Flex 
          justifyContent="space-between" 
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          gap={{ base: 1.5, md: 0 }}
        >
          <HStack spacing={3} align="flex-start">
            {IconComponent && (
              <Icon
                as={IconComponent}
                boxSize={5}
                color="blue.500"
              />
            )}
            <Box>
              <Heading
                as="h1"
                size={{ base: "sm", md: "md" }}
                bgGradient={titleGradient}
                bgClip="text"
                lineHeight="shorter"
              >
                {title}
              </Heading>
              {subtitle && (
                <Text 
                  color={subtitleColor} 
                  mt={0.5}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  {subtitle}
                </Text>
              )}
              {description && (
                <Text 
                  color="gray.500" 
                  mt={1}
                  fontSize="xs"
                >
                  {description}
                </Text>
              )}
            </Box>
          </HStack>
          {rightContent && (
            <Box mt={{ base: 1.5, md: 0 }}>{rightContent}</Box>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
