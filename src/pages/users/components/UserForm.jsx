import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  Button,
} from '@chakra-ui/react'

export default function UserForm({ formData, handleInputChange, handleSubmit, isEdit }) {
  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Nome Completo</FormLabel>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Digite o nome completo"
          />
        </FormControl>

        {!isEdit && (
          <>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite o email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite a senha"
              />
            </FormControl>
          </>
        )}

        <FormControl>
          <FormLabel>Função</FormLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="user">Usuário</option>
            <option value="manager">Gerente</option>
            <option value="admin">Administrador</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue" width="100%">
          {isEdit ? 'Atualizar' : 'Criar'}
        </Button>
      </VStack>
    </form>
  )
}
