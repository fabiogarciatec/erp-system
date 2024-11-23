import { Box, Flex, Text, Button, useColorMode, IconButton } from '@chakra-ui/react'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { profile } = useAuth()

  return (
    <Box bg="white" px={8} py={4} shadow="sm">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="medium">
          {profile?.company?.name || 'Bem-vindo'}
        </Text>

        <Flex align="center" gap={4}>
          <IconButton
            icon={colorMode === 'light' ? <MdDarkMode /> : <MdLightMode />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label={`Alternar para modo ${colorMode === 'light' ? 'escuro' : 'claro'}`}
          />
        </Flex>
      </Flex>
    </Box>
  )
}
