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
} from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiCamera, FiTrash2, FiSave } from 'react-icons/fi';
import { useProfileStyles } from '@/hooks/useProfileStyles';
import { useProfileLogic } from '@/hooks/useProfileLogic';
import { PageHeader } from '@/components/PageHeader';

export default function Perfil() {
  const styles = useProfileStyles();
  const {
    profile,
    isLoading,
    isUploading,
    fileInputRef,
    handleInputChange,
    formatPhoneForDisplay,
    handleAvatarChange,
    handleRemoveAvatar,
    handleSave
  } = useProfileLogic();

  if (!profile) {
    return (
      <Box px={4}>
        <Text>Carregando...</Text>
      </Box>
    );
  }

  return (
    <Box bg="inherit" minH="100vh">
      <PageHeader
        title="Perfil"
        subtitle="Gerencie suas informações pessoais"
        icon={FiUser}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Perfil', href: '/configuracoes/profile' },
        ]}
      />

      <Box px={{ base: 4, xl: 8 }} pb={12}>
        <VStack spacing={6} w="full" align="stretch">
          {/* Bloco do Avatar */}
          <Box 
            borderWidth="2px" 
            borderRadius="lg" 
            p={6}
            bg={styles.colors.bg}
            borderColor={styles.colors.border}
            w="full"
          >
            <VStack spacing={4} align="center">
              <Box position="relative">
                <Avatar
                  size="xl"
                  src={profile.avatar_url || undefined}
                  name={profile.full_name || profile.email}
                  borderWidth="2px"
                  borderColor={styles.colors.border}
                />
                
                {/* Botões de ação */}
                <HStack 
                  position="absolute" 
                  bottom="-3" 
                  right="-8" 
                  spacing={1}
                  zIndex={2}
                >
                  <input
                    type="file"
                    id="avatar-input"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <Tooltip label="Alterar foto" placement="top">
                    <IconButton
                      isLoading={isUploading}
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
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </Tooltip>

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
              </Box>
              <VStack spacing={1}>
                <Heading size="md">{profile.full_name || 'Nome não definido'}</Heading>
                <Text color={styles.colors.text}>{profile.email}</Text>
                {profile.role && (
                  <HStack 
                    spacing={2} 
                    bg={styles.colors.roleTag}
                    px={3} 
                    py={1} 
                    rounded="full"
                  >
                    <Icon as={FiUser} color={styles.colors.icon} />
                    <Text fontSize="sm" color={styles.colors.text}>
                      {profile.role}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Box>

          {/* Bloco de Informações Pessoais */}
          <Box 
            borderWidth="2px" 
            borderRadius="lg" 
            p={6}
            bg={styles.colors.bg}
            borderColor={styles.colors.border}
            w="full"
          >
            <Heading size="md" mb={4}>Informações Pessoais</Heading>
            <Divider mb={6} borderColor={styles.colors.border} />
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel color={styles.colors.label}>
                  <HStack spacing={2}>
                    <Icon as={FiUser} color={styles.colors.icon} />
                    <Text>Nome Completo</Text>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder="Seu nome completo"
                  value={profile.full_name || ''}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  bg={styles.colors.input}
                  {...styles.components.input}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={styles.colors.label}>
                  <HStack spacing={2}>
                    <Icon as={FiMail} color={styles.colors.icon} />
                    <Text>E-mail</Text>
                  </HStack>
                </FormLabel>
                <Input
                  value={profile.email}
                  isReadOnly
                  bg={styles.colors.inputReadOnly}
                  opacity={0.8}
                  cursor="not-allowed"
                />
              </FormControl>

              <FormControl>
                <FormLabel color={styles.colors.label}>
                  <HStack spacing={2}>
                    <Icon as={FiBriefcase} color={styles.colors.icon} />
                    <Text>Cargo</Text>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder="Seu cargo na empresa"
                  value={profile.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  bg={styles.colors.input}
                  {...styles.components.input}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={styles.colors.label}>
                  <HStack spacing={2}>
                    <Icon as={FiPhone} color={styles.colors.icon} />
                    <Text>Telefone</Text>
                  </HStack>
                </FormLabel>
                <Input
                  type="tel"
                  value={formatPhoneForDisplay(profile.phone)}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  bg={styles.colors.input}
                  {...styles.components.input}
                />
              </FormControl>
            </VStack>

            <Divider my={8} borderColor={styles.colors.border} />

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
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
