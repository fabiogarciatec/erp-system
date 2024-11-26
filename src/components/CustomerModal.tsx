import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Switch,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { createCustomer, updateCustomer } from '../services/customers'
import { Customer } from '../types/customer'

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer?: Customer
  onSuccess: () => void
}

export function CustomerModal({ isOpen, onClose, customer, onSuccess }: CustomerModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (customer) {
      setName(customer.name)
      setEmail(customer.email || '')
      setPhone(customer.phone || '')
      setIsActive(customer.status === 'active')
    } else {
      setName('')
      setEmail('')
      setPhone('')
      setIsActive(true)
    }
  }, [customer])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      const customerData: Omit<Customer, 'id' | 'created_at'> = {
        name,
        email,
        phone,
        status: isActive ? 'active' : 'inactive',
        last_purchase: null
      }

      if (customer?.id) {
        await updateCustomer(customer.id, customerData)
        toast({
          title: 'Cliente atualizado com sucesso!',
          status: 'success',
          duration: 3000,
        })
      } else {
        await createCustomer(customerData)
        toast({
          title: 'Cliente criado com sucesso!',
          status: 'success',
          duration: 3000,
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: 'Erro ao salvar cliente',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{customer ? 'Editar Cliente' : 'Novo Cliente'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Telefone</FormLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Cliente Ativo</FormLabel>
              <Switch isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
