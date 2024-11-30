import {
  Box,
  Container,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  HStack,
  useToast,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/PageHeader';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar_url?: string | null;
  role: string;
  department?: string;
}

export function Profile() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: usuario?.nome || '',
    email: usuario?.email || '',
    phone: '',
    avatar_url: usuario?.avatar_url || undefined,
    role: usuario?.role || '',
    department: '',
  });

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      
      // Atualiza o perfil no Supabase
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome: profile.name,
          phone: profile.phone,
          department: profile.department,
        })
        .eq('id', usuario?.id);

      if (error) throw error;

      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar suas informações.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      
      // Upload do avatar para o storage do Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${usuario?.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Atualiza o avatar_url no perfil do usuário
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          avatar_url: data?.path,
        })
        .eq('id', usuario?.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: data?.path }));
      
      toast({
        title: 'Avatar atualizado',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível atualizar sua foto de perfil.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%">
      <PageHeader 
        title="Perfil"
        subtitle="Gerencie suas informações pessoais"
        breadcrumbs={[
          { label: 'Perfil', href: '/profile' }
        ]}
      />
      
      <Box 
        mt="154px"  
        px={6}
      >
        <Box maxW="1600px" mx="auto">
          <Card mt={6}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Avatar */}
                <Box textAlign="center">
                  <Avatar
                    size="2xl"
                    name={profile.name}
                    src={profile.avatar_url || undefined}
                    mb={4}
                  />
                  <FormControl>
                    <FormLabel htmlFor="avatar" cursor="pointer">
                      <Button as="span" size="sm">
                        Alterar foto
                      </Button>
                    </FormLabel>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={handleFileUpload}
                    />
                  </FormControl>
                </Box>

                <Divider />

                {/* Informações básicas */}
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel>Nome</FormLabel>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>E-mail</FormLabel>
                      <Input
                        value={profile.email}
                        isReadOnly
                        bg="gray.50"
                      />
                    </FormControl>
                  </HStack>

                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel>Telefone</FormLabel>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Seu telefone"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Departamento</FormLabel>
                      <Input
                        value={profile.department}
                        onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Seu departamento"
                      />
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormLabel>Cargo</FormLabel>
                    <Input
                      value={profile.role}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>
                </VStack>

                <Button
                  colorScheme="blue"
                  onClick={handleUpdateProfile}
                  isLoading={isLoading}
                  alignSelf="flex-end"
                >
                  Salvar alterações
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
