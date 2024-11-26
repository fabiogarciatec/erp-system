import { ReactNode } from 'react'
import {
  Box,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  useColorModeValue,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react'
import { FiMenu } from 'react-icons/fi'
import { SidebarContent } from './Sidebar'
import { useAuth } from '../contexts/AuthContext'

interface DashboardLayoutProps extends BoxProps {
  children: ReactNode
}

export default function DashboardLayout({ children, ...rest }: DashboardLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuth()

  return (
    <Box minH="100vh" display="flex" {...rest}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      <Box 
        flex="1"
        ml={{ base: 0, md: "240px" }}
        bg="gray.50"
        w="full"
      >
        <Flex
          py={1}
          alignItems="center"
          justifyContent={{ base: 'space-between', md: 'flex-end' }}
          borderBottomWidth="1px"
          bg="white"
          px={2}
          w="full"
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
          <Text
            display={{ base: 'flex', md: 'none' }}
            fontSize="2xl"
            fontWeight="bold"
          >
            ERP FATEC
          </Text>
          <Text color="gray.600" fontSize="sm">
            {user?.email}
          </Text>
        </Flex>
        <Box p={2}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
