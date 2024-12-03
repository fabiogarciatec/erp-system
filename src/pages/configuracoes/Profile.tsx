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
  useColorModeValue,
  useToast,
  Avatar,
  AvatarBadge,
  IconButton,
  VStack,
  HStack,
  Icon,
  Tooltip,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiEdit, FiCamera, FiTrash2, FiSave } from 'react-icons/fi';
import { useEffect, useState, useRef } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/PageHeader';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string | null;
  phone: string | null;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function Perfil() {
  // Hooks do contexto
  const { user } = useAuth();
  const toast = useToast();

  // Hooks de tema
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBorderColor = useColorModeValue('gray.300', 'gray.500');
  const avatarBorderColor = useColorModeValue('white', 'gray.600');
  const badgeBg = useColorModeValue('gray.100', 'gray.700');
  const avatarBg = useColorModeValue('gray.100', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const readOnlyBg = useColorModeValue('gray.50', 'gray.600');

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Funções auxiliares
  const loadUserProfile = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Efeitos
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;

    // Remove a máscara do telefone antes de salvar
    if (field === 'phone') {
      value = value.replace(/\D/g, ''); // Remove tudo que não é número
    }

    setProfile({ ...profile, [field]: value });
  };

  const formatPhoneForDisplay = (phone: string | null) => {
    if (!phone) return '';
    
    // Garante que temos apenas números
    const numbers = phone.replace(/\D/g, '');
    
    // Aplica a formatação manualmente
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return numbers;
  };

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    
    // Validação do tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Tipo de arquivo inválido',
        description: 'Por favor, selecione uma imagem no formato JPG, PNG ou GIF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validação do tamanho do arquivo (2MB)
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 2) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é 2MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Gera um nome único para o arquivo
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${user?.id}-${timestamp}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Se existe um avatar anterior, tenta removê-lo
      if (profile?.avatar_url) {
        try {
          const oldAvatarPath = profile.avatar_url.split('/').pop();
          if (oldAvatarPath) {
            await supabase.storage
              .from('avatars')
              .remove([`avatars/${oldAvatarPath}`]);
          }
        } catch (error) {
          console.warn('Erro ao remover avatar antigo:', error);
          // Continua com o upload mesmo se falhar ao remover o antigo
        }
      }

      // Upload do novo avatar
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type // Garante que o tipo do arquivo seja preservado
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!uploadData) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      // Obtém a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Erro ao gerar URL pública da imagem');
      }

      // Atualiza o perfil com a nova URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Atualiza o estado local
      setProfile(prev => prev ? {
        ...prev,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      } : null);
      
      toast({
        title: 'Foto atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
      toast({
        title: 'Erro ao atualizar foto',
        description: error.message || 'Ocorreu um erro ao atualizar sua foto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: null });
      toast({
        title: 'Foto removida com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover foto',
        description: error?.message || 'Ocorreu um erro ao remover a foto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          role: profile.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Perfil atualizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Box w="100%">
      <PageHeader 
        title="Perfil"
        subtitle="Gerencie suas informações pessoais"
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Perfil', href: '/configuracoes/perfil' }
        ]}
      />

      {/* Content */}
      <Box 
        mt="125px"
        px={6}
      >
        <Box maxW="1600px" mx="auto">
          <Stack spacing={8}>
            {/* Card do Avatar e Informações Básicas */}
            <Card bg={cardBg} borderColor={borderColor} shadow="sm">
              <CardBody>
                <VStack spacing={6} align="center">
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={profile.full_name || profile.email}
                      src={profile.avatar_url || undefined}
                      bg={avatarBg}
                      borderWidth={2}
                      borderColor={avatarBorderColor}
                      boxShadow="lg"
                    />
                    
                    {/* Botões de ação */}
                    <HStack 
                      position="absolute" 
                      bottom="-3" 
                      right="-8" 
                      spacing={1}
                      zIndex={2}
                      transform="translateX(-12px)"
                    >
                      {/* Botão de upload */}
                      <label htmlFor="avatar-input">
                        <Tooltip label="Alterar foto" placement="top">
                          <IconButton
                            as="div"
                            size="xs"
                            rounded="full"
                            colorScheme="blue"
                            aria-label="Alterar foto"
                            icon={<Icon as={FiCamera} fontSize="0.9rem" />}
                            boxShadow="base"
                            _hover={{
                              transform: 'scale(1.1)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
                            cursor="pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('avatar-input')?.click();
                            }}
                            isLoading={isLoading}
                          />
                        </Tooltip>
                      </label>

                      {/* Botão de remover */}
                      {profile.avatar_url && (
                        <Tooltip label="Remover foto" placement="right">
                          <IconButton
                            aria-label="Remover foto"
                            icon={<Icon as={FiTrash2} fontSize="0.9rem" />}
                            size="xs"
                            colorScheme="red"
                            variant="solid"
                            rounded="full"
                            onClick={handleRemoveAvatar}
                            isLoading={isLoading}
                            boxShadow="base"
                            _hover={{
                              transform: 'scale(1.1)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
                          />
                        </Tooltip>
                      )}
                    </HStack>

                    <Input
                      type="file"
                      id="avatar-input"
                      accept="image/jpeg,image/png,image/gif"
                      display="none"
                      onChange={handleAvatarChange}
                      onClick={(e) => {
                        // Reset o valor para permitir selecionar o mesmo arquivo novamente
                        (e.target as HTMLInputElement).value = '';
                      }}
                    />
                  </Box>
                  <VStack spacing={1}>
                    <Heading size="md">{profile.full_name || 'Nome não definido'}</Heading>
                    <Text color="gray.500">{profile.email}</Text>
                    {profile.role && (
                      <HStack 
                        spacing={2} 
                        bg={badgeBg} 
                        px={3} 
                        py={1} 
                        rounded="full"
                      >
                        <Icon as={FiUser} color="gray.500" />
                        <Text fontSize="sm" color="gray.500">
                          {profile.role}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Card das Informações Detalhadas */}
            <Card bg={cardBg} borderColor={borderColor} shadow="sm">
              <CardHeader>
                <Heading size="md">Informações Pessoais</Heading>
              </CardHeader>
              <Divider />
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel>
                      <HStack spacing={2}>
                        <Icon as={FiUser} color="gray.500" />
                        <Text>Nome Completo</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      placeholder="Seu nome completo"
                      value={profile.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{
                        borderColor: hoverBorderColor
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack spacing={2}>
                        <Icon as={FiMail} color="gray.500" />
                        <Text>E-mail</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={profile.email}
                      isReadOnly
                      bg={readOnlyBg}
                      opacity={0.8}
                      cursor="not-allowed"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack spacing={2}>
                        <Icon as={FiBriefcase} color="gray.500" />
                        <Text>Cargo</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      placeholder="Seu cargo na empresa"
                      value={profile.role || ''}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{
                        borderColor: hoverBorderColor
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      <HStack spacing={2}>
                        <Icon as={FiPhone} color="gray.500" />
                        <Text>Telefone</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      ref={phoneInputRef}
                      type="tel"
                      value={formatPhoneForDisplay(profile.phone)}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{
                        borderColor: hoverBorderColor
                      }}
                    />
                  </FormControl>
                </SimpleGrid>

                <Divider my={8} />

                <Flex justify="center">
                  <Button
                    colorScheme="blue"
                    size="lg"
                    leftIcon={<Icon as={FiSave} />}
                    onClick={handleSave}
                    isLoading={isLoading}
                    loadingText="Salvando..."
                    boxShadow="base"
                    px={12}
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    Salvar Alterações
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
