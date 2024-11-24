import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  Button,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { useState } from 'react'
import { MdVisibility, MdVisibilityOff, MdInfo } from 'react-icons/md'
import { formatPhone, cleanPhone, isValidPhone } from '../../../utils/formatters'

export default function UserForm({ formData, handleInputChange, handleSubmit, isEdit, isLoading }) {
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.full_name) {
      newErrors.full_name = 'Nome é obrigatório'
    }

    if (!isEdit) {
      if (!formData.email) {
        newErrors.email = 'Email é obrigatório'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido'
      }

      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
      }
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (00) 00000-0000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitWithValidation = (e) => {
    e.preventDefault()
    if (validateForm()) {
      handleSubmit(e)
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    handleInputChange({
      target: {
        name: 'phone',
        value: formatted
      }
    })
  }

  return (
    <form onSubmit={handleSubmitWithValidation}>
      <VStack spacing={4}>
        <FormControl isRequired isInvalid={!!errors.full_name}>
          <FormLabel>Nome Completo</FormLabel>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Digite o nome completo"
          />
          <FormErrorMessage>{errors.full_name}</FormErrorMessage>
        </FormControl>

        {!isEdit && (
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Digite o email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
        )}

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel>
            <Tooltip label="Formato: (00) 00000-0000" placement="top-start">
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                Telefone
                <Icon as={MdInfo} ml={1} />
              </span>
            </Tooltip>
          </FormLabel>
          <InputGroup>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </InputGroup>
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Função</FormLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="sales">Vendedor</option>
            <option value="support">Suporte</option>
            <option value="user">Usuário</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
            <option value="blocked">Bloqueado</option>
          </Select>
        </FormControl>

        {!isEdit && (
          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite a senha"
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  size="sm"
                >
                  <Icon as={showPassword ? MdVisibilityOff : MdVisibility} />
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          mt={4}
          isLoading={isLoading}
          loadingText={isEdit ? "Atualizando..." : "Cadastrando..."}
        >
          {isEdit ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </VStack>
    </form>
  )
}
