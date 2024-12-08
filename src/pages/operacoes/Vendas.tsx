import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';

export default function Vendas() {
  const navigate = useNavigate();

  const handleExportVendas = () => {
    // implementação da lógica de exportação
  };

  return (
    <Box w="100%">
      <PageHeader 
        title="Vendas"
        subtitle="Gerencie as vendas da empresa"
        breadcrumbs={[
          { label: 'Operações', href: '/operacoes' },
          { label: 'Vendas', href: '/operacoes/vendas' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportVendas}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => navigate('/operacoes/vendas/nova')}
            >
              Nova Venda
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
