import { useEffect, useRef, useState } from 'react';
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
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Stack,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
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
      onClose();
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
                bg="blue.500"
              />
              <IconButton
                icon={<FiCamera />}
                aria-label="Change photo"
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
            <Stack spacing={4}>
              <Text>
                Selecione uma nova foto para seu perfil. A imagem deve estar no formato JPG, PNG ou GIF.
              </Text>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                colorScheme="blue"
                leftIcon={<FiCamera />}
                isLoading={isLoading}
              >
                Escolher Foto
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
