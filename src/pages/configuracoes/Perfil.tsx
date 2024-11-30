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
} from '@chakra-ui/react';
import { FiCamera, FiSave } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
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
  // 1. Hooks do Context
  const { user } = useAuth();
  const toast = useToast();

  // 2. Hooks de State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 3. Hooks de Theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 4. Effects
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id || !user?.email) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Se não encontrou o perfil, cria um novo com os dados básicos
      if (!data) {
        const newProfile: UserProfile = {
          id: user.id,
          email: user.email,
          full_name: null,
          phone: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) throw insertError;

        setProfile(newProfile);
      } else {
        // Se encontrou o perfil, atualiza com os dados do banco
        setProfile({
          ...data,
          email: user.email, // Email do auth.users
        } as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: 'Erro ao carregar perfil',
        description: 'Não foi possível carregar as informações do perfil.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSave = async () => {
    if (!profile || !user?.id || !user?.email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profile.full_name || null,
          phone: profile.phone || null,
          avatar_url: profile.avatar_url || null,
          role: profile.role || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Recarrega o perfil para garantir que temos os dados mais atualizados
      loadUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar as informações.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user?.id) return;

      // Validar tamanho do arquivo (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo permitido é 2MB.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsLoading(true);

      // Buscar perfil atual para obter URL do avatar antigo
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
      } else if (currentProfile?.avatar_url) {
        // Extrair nome do arquivo da URL antiga
        try {
          const oldFileUrl = new URL(currentProfile.avatar_url);
          const oldFileName = oldFileUrl.pathname.split('/').pop();
          
          if (oldFileName) {
            console.log('Removendo avatar antigo:', oldFileName);
            // Remover arquivo antigo
            const { error: removeError } = await supabase.storage
              .from('avatars')
              .remove([oldFileName]);

            if (removeError) {
              console.error('Erro ao remover avatar antigo:', removeError);
            } else {
              console.log('Avatar antigo removido com sucesso');
            }
          }
        } catch (error) {
          console.error('Erro ao processar URL antiga:', error);
        }
      }

      // Nome do arquivo simples
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}.${fileExt}`;

      console.log('Iniciando upload do novo avatar:', fileName);

      // Upload do novo avatar
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload realizado com sucesso');

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('URL gerada:', publicUrl);

      // Atualizar perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        throw updateError;
      }

      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);

      toast({
        title: 'Avatar atualizado',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: 'Erro ao atualizar avatar',
        description: 'Não foi possível fazer o upload da imagem. Tente novamente.',
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
            <Card bg={bgColor} borderColor={borderColor} shadow="sm">
              <CardBody>
                <VStack spacing={6} align="center">
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      src={profile.avatar_url || undefined}
                      name={profile.full_name || profile.email}
                    >
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-10px"
                        colorScheme="blue"
                        aria-label="Editar foto"
                        icon={<FiCamera />}
                        onClick={() => document.getElementById('avatar-input')?.click()}
                      />
                    </Avatar>
                    <Input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={handleAvatarChange}
                    />
                  </Box>
                  <VStack spacing={1}>
                    <Heading size="md">{profile.full_name || 'Nome não definido'}</Heading>
                    <Text color="gray.500">{profile.email}</Text>
                    <Text color="gray.500">{profile.role || 'Cargo não definido'}</Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Card das Informações Detalhadas */}
            <Card bg={bgColor} borderColor={borderColor} shadow="sm">
              <CardHeader>
                <Heading size="md">Informações Pessoais</Heading>
              </CardHeader>
              <Divider />
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Nome Completo</FormLabel>
                      <Input
                        value={profile.full_name || ''}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>E-mail</FormLabel>
                      <Input value={profile.email} isReadOnly />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Telefone</FormLabel>
                      <Input
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="Seu telefone"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel>Cargo</FormLabel>
                      <Input value={profile.role || ''} isReadOnly />
                    </FormControl>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Botões de Ação */}
            <HStack justify="flex-end" spacing={4}>
              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isLoading}
              >
                Salvar Alterações
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
