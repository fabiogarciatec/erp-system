import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUser, FiLock, FiMail, FiBell, FiGlobe, FiDatabase } from 'react-icons/fi';

const settingsCards = [
  {
    title: 'Perfil',
    description: 'Gerencie suas informações pessoais e preferências',
    icon: FiUser,
  },
  {
    title: 'Segurança',
    description: 'Configure senha e autenticação em duas etapas',
    icon: FiLock,
  },
  {
    title: 'Notificações',
    description: 'Personalize suas preferências de notificação',
    icon: FiBell,
  },
  {
    title: 'Email',
    description: 'Configure integrações de email e assinaturas',
    icon: FiMail,
  },
  {
    title: 'Localização',
    description: 'Ajuste fuso horário e formato de data',
    icon: FiGlobe,
  },
  {
    title: 'Backup',
    description: 'Configure backup automático de dados',
    icon: FiDatabase,
  },
];

const Settings = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <Box p={8}>
      <Heading mb={6}>Configurações</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {settingsCards.map((card) => (
          <Card
            key={card.title}
            bg={cardBg}
            _hover={{
              bg: cardHoverBg,
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
              cursor: 'pointer',
            }}
            transition="all 0.2s"
          >
            <CardHeader display="flex" alignItems="center" gap={4}>
              <Icon as={card.icon} boxSize={6} color="blue.500" />
              <Heading size="md">{card.title}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{card.description}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Settings;
