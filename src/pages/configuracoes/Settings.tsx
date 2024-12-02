import {
  Box,
  Container,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUser, FiUsers, FiSettings, FiDatabase, FiLink, FiBell, FiShield } from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';

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
    href: '/configuracoes/perfil',
  },
  {
    title: 'Empresa',
    description: 'Gerencie informações da empresa',
    icon: FiUsers,
    href: '/configuracoes/empresa',
  },
  {
    title: 'Geral',
    description: 'Configurações gerais do sistema',
    icon: FiSettings,
    href: '/configuracoes/gerais',
  },
  {
    title: 'Usuários',
    description: 'Gerencie usuários e permissões',
    icon: FiUsers,
    href: '/configuracoes/usuarios',
  },
  {
    title: 'Segurança',
    description: 'Configure opções de segurança e autenticação',
    icon: FiShield,
    href: '/configuracoes/seguranca',
  },
  {
    title: 'Notificações',
    description: 'Configure suas preferências de notificação',
    icon: FiBell,
    href: '/configuracoes/notificacoes',
  },
  {
    title: 'Integrações',
    description: 'Gerencie integrações com outros sistemas',
    icon: FiLink,
    href: '/configuracoes/integracoes',
  },
  {
    title: 'Backup',
    description: 'Configure e gerencie backups do sistema',
    icon: FiDatabase,
    href: '/configuracoes/backup',
  },
];

export function Settings() {
  const location = useLocation();
  const cardBg = useColorModeValue('white', 'gray.700');
  const isRoot = location.pathname === '/configuracoes' || location.pathname === '/configuracoes/';

  if (!isRoot) {
    return <Outlet />;
  }

  return (
    <Box w="100%">
      <PageHeader 
        title="Configurações"
        subtitle="Gerencie as configurações do sistema"
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' }
        ]}
      />
      
      <Box 
        mt="154px"  
        px={6}
      >
        <Box maxW="1600px" mx="auto">
          <Container maxW="container.xl" py={8}>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
              {settingCards.map((card) => (
                <Card
                  key={card.href}
                  as={Link}
                  to={card.href}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                  bg={cardBg}
                >
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <Icon as={card.icon} boxSize={6} color="blue.500" />
                      <Box>
                        <Text fontSize="lg" fontWeight="bold">
                          {card.title}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {card.description}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default Settings;
