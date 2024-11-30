import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';

export default function NotasFiscais() {
  const navigate = useNavigate();
  
  const handleExportNotas = () => {
    // Implementar lógica de exportação
  };

  return (
    <Box w="100%">
      <PageHeader 
        title="Notas Fiscais"
        subtitle="Gerencie as notas fiscais da empresa"
        breadcrumbs={[
          { label: 'Operações', href: '/operacoes' },
          { label: 'Notas Fiscais', href: '/operacoes/notas-fiscais' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportNotas}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => navigate('/operacoes/notas-fiscais/nova')}
            >
              Nova Nota Fiscal
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
