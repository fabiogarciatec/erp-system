import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Stack,
  Text,
  Avatar,
  AvatarBadge,
  IconButton,
  VStack,
  HStack,
  Icon,
  Tooltip,
  Flex,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiCamera, FiTrash2, FiSave } from 'react-icons/fi';
import { useProfileStyles } from '@/hooks/useProfileStyles';
import { useProfileLogic } from '@/hooks/useProfileLogic';
import { PageHeader } from '@/components/PageHeader';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const styles = useProfileStyles();
  const toast = useToast();
  const {
    profile,
    isLoading,
    isUploading,
    fileInputRef,
    handleInputChange,
    formatPhoneForDisplay,
    handleAvatarChange,
    handleRemoveAvatar,
    handleSave,
    handlePasswordChange
  } = useProfileLogic();

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev: PasswordForm) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const success = await handlePasswordChange(passwordForm.currentPassword, passwordForm.newPassword);
    if (success) {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  if (!profile) {
    return (
      <Box px={4}>
        <Text>Carregando...</Text>
      </Box>
    );
  }

  console.log('Profile in component:', profile);
  console.log('Role in component:', profile.role);

  return (
    <Box bg="inherit" minH="100vh">
      <PageHeader
        title="Perfil"
        subtitle="Gerencie suas informações pessoais"
        icon={FiUser}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Perfil', href: '/configuracoes/perfil' },
        ]}
      />

      <Box px={{ base: 4, xl: 8 }} pb={12}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          <GridItem>
            <Card>
              <CardHeader>
                <Heading size="md">Informações Pessoais</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Nome Completo</FormLabel>
                    <Input
                      value={profile.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>E-mail</FormLabel>
                    <Input
                      value={profile.email}
                      isReadOnly
                      bg="gray.50"
                      _dark={{ bg: 'whiteAlpha.50' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Telefone</FormLabel>
                    <Input
                      value={formatPhoneForDisplay(profile.phone)}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Função</FormLabel>
                    <Input
                      value={profile.role}
                      isReadOnly
                      bg="gray.50"
                      _dark={{ bg: 'whiteAlpha.50' }}
                    />
                  </FormControl>

                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="blue"
                    onClick={handleSave}
                    isLoading={isLoading}
                  >
                    Salvar Alterações
                  </Button>
                </Stack>
              </CardBody>
            </Card>

            <Card mt={8}>
              <CardHeader>
                <Heading size="md">Alterar Senha</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Senha Atual</FormLabel>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordFormChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Nova Senha</FormLabel>
                    <Input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordFormChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordFormChange}
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    onClick={handlePasswordSubmit}
                    isLoading={isLoading}
                    w="full"
                  >
                    Alterar Senha
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <Heading size="md">Foto do Perfil</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6}>
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      src={profile.avatar_url || undefined}
                      name={profile.full_name || undefined}
                    >
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="red"
                        aria-label="Remover Imagem"
                        icon={<FiTrash2 />}
                        onClick={handleRemoveAvatar}
                      />
                    </Avatar>
                  </Box>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <Button
                    leftIcon={<FiCamera />}
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isUploading}
                    w="full"
                  >
                    Alterar Foto
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Profile;
