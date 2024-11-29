import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Card,
  CardBody,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUser, FiUsers, FiSettings, FiDatabase, FiLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface SettingCard {
  title: string;
  description: string;
  icon: any;
  href: string;
}

const settingCards: SettingCard[] = [
  {
    title: 'Perfil',
    description: 'Gerencie suas informações pessoais e preferências',
    icon: FiUser,
    href: '/settings/profile',
  },
  {
    title: 'Usuários',
    description: 'Gerencie os usuários do sistema',
    icon: FiUsers,
    href: '/settings/users',
  },
  {
    title: 'Configurações Gerais',
    description: 'Configurações gerais do sistema',
    icon: FiSettings,
    href: '/settings/general',
  },
  {
    title: 'Backup',
    description: 'Configure e gerencie backups do sistema',
    icon: FiDatabase,
    href: '/settings/backup',
  },
  {
    title: 'Integrações',
    description: 'Gerencie integrações com outros sistemas',
    icon: FiLink,
    href: '/settings/integrations',
  },
];

export function Settings() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Configurações
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {settingCards.map((card) => (
          <Card
            key={card.title}
            as={Link}
            to={card.href}
            _hover={{
              bg: cardHoverBg,
              transform: 'translateY(-2px)',
              boxShadow: 'md',
            }}
            bg={cardBg}
            transition="all 0.2s"
            cursor="pointer"
          >
            <CardBody>
              <VStack align="start" spacing={4}>
                <Icon as={card.icon} boxSize={6} color="blue.500" />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {card.title}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {card.description}
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
