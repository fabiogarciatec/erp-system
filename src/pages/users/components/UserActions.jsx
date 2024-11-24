import { HStack, IconButton, Tooltip } from '@chakra-ui/react'
import { MdEdit, MdDelete, MdLock } from 'react-icons/md'

export default function UserActions({ onEdit, onDelete, onResetPassword, user }) {
  return (
    <HStack spacing={2}>
      <Tooltip label="Editar usuário">
        <IconButton
          icon={<MdEdit />}
          aria-label="Editar"
          size="sm"
          onClick={() => onEdit(user)}
        />
      </Tooltip>
      
      <Tooltip label="Resetar senha">
        <IconButton
          icon={<MdLock />}
          aria-label="Resetar senha"
          size="sm"
          colorScheme="yellow"
          onClick={() => onResetPassword(user)}
        />
      </Tooltip>

      <Tooltip label="Excluir usuário">
        <IconButton
          icon={<MdDelete />}
          aria-label="Excluir"
          size="sm"
          colorScheme="red"
          onClick={() => onDelete(user)}
        />
      </Tooltip>
    </HStack>
  )
}
