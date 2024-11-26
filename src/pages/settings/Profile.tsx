import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Center,
  IconButton,
  FormErrorMessage,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { useProfile, ProfileData } from '../../hooks/useProfile';

export function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  } = useProfile();

  const [formData, setFormData] = useState<Partial<ProfileData>>({
    full_name: '',
    email: '',
    position: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        position: profile.position || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await updateProfile(formData);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
      onClose(); // Fecha o modal após o upload
    }
  };

  if (isLoading && !profile) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box w="full" p={4}>
      <PageHeader
        title="Perfil"
        subtitle="Gerencie suas informações pessoais"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/settings' },
          { label: 'Perfil', href: '/settings/profile' },
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <VStack spacing={6} align="stretch" maxW="600px" mx="auto">
          <Center>
            <Box position="relative">
              <Avatar 
                size="2xl" 
                name={formData.full_name} 
                src={profile?.avatar_url}
              />
              <IconButton
                aria-label="Change photo"
                icon={<FiCamera />}
                size="sm"
                colorScheme="blue"
                rounded="full"
                position="absolute"
                bottom="0"
                right="0"
                onClick={onOpen}
              />
            </Box>
          </Center>

          <FormControl>
            <FormLabel>Nome Completo</FormLabel>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
            />
          </FormControl>

          <FormControl>
            <FormLabel>E-mail</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Cargo</FormLabel>
            <Input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Seu cargo"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Telefone</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
            />
          </FormControl>

          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isLoading}
          >
            Salvar Alterações
          </Button>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Atualizar Foto de Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              w="full"
              h="150px"
              variant="outline"
              _hover={{ bg: 'gray.50' }}
            >
              Clique ou arraste uma imagem aqui
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
