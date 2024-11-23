import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />
      <Box
        flex={1}
        ml="64px"
        p={6}
        position="relative"
        overflowY="auto"
      >
        {children}
      </Box>
    </Flex>
  )
}
