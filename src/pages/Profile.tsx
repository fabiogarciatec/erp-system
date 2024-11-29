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

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}

const mockProfile: UserProfile = {
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '(11) 99999-9999',
  company: 'Empresa Demo',
  role: 'Administrador',
};

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const handleSave = () => {
    // Aqui será implementada a lógica de salvar no banco de dados
    setIsEditing(false);
    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram atualizadas com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Perfil
          </Text>
        </Box>

        <Card>
          <CardBody>
            <VStack spacing={6} align="center">
              <Avatar
                size="2xl"
                name={profile.name}
                src="https://bit.ly/broken-link"
              />
              
              <VStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Empresa</FormLabel>
                  <Input
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cargo</FormLabel>
                  <Input
                    value={profile.role}
                    onChange={(e) =>
                      setProfile({ ...profile, role: e.target.value })
                    }
                    isReadOnly={!isEditing}
                  />
                </FormControl>
              </VStack>

              <Divider />

              <HStack spacing={4} w="100%" justify="flex-end">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button colorScheme="blue" onClick={handleSave}>
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button
                    colorScheme="blue"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
