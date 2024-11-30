import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';

export default function Orcamentos() {
  const navigate = useNavigate();

  const handleExportOrcamentos = () => {
    // implementação do handleExportOrcamentos
  };

  return (
    <Box w="100%">
      <PageHeader 
        title="Orçamentos"
        subtitle="Gerencie os orçamentos da empresa"
        breadcrumbs={[
          { label: 'Operações', href: '/operacoes' },
          { label: 'Orçamentos', href: '/operacoes/orcamentos' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportOrcamentos}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => navigate('/operacoes/orcamentos/novo')}
            >
              Novo Orçamento
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
