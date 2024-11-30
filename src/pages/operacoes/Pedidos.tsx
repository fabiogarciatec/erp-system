import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';

export default function Pedidos() {
  const navigate = useNavigate();

  const handleExportPedidos = () => {
    // implementação do handleExportPedidos
  };

  return (
    <Box w="100%">
      <PageHeader 
        title="Pedidos"
        subtitle="Gerencie os pedidos da empresa"
        breadcrumbs={[
          { label: 'Operações', href: '/operacoes' },
          { label: 'Pedidos', href: '/operacoes/pedidos' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportPedidos}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => navigate('/operacoes/pedidos/novo')}
            >
              Novo Pedido
            </Button>
          </Box>
        }
      />

      {/* Content */}
      <Box 
        mt="125px"
        px={6}
      >
        <Box maxW="1600px" mx="auto">
          {/* Conteúdo da página */}
        </Box>
      </Box>
    </Box>
  );
}
