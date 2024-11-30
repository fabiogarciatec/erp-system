import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  dataCriacao: string;
}

const categoriasIniciais: Categoria[] = [
  {
    id: 1,
    nome: 'Eletrônicos',
    descricao: 'Produtos eletrônicos em geral',
    dataCriacao: '2024-01-15',
  },
  {
    id: 2,
    nome: 'Móveis',
    descricao: 'Móveis para casa e escritório',
    dataCriacao: '2024-01-15',
  },
  {
    id: 3,
    nome: 'Vestuário',
    descricao: 'Roupas e acessórios',
    dataCriacao: '2024-01-15',
  },
];

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciais);
  const [novaCategoria, setNovaCategoria] = useState<Omit<Categoria, 'id' | 'dataCriacao'>>({
    nome: '',
    descricao: '',
  });
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleAdicionarCategoria = () => {
    if (!novaCategoria.nome || !novaCategoria.descricao) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const novoId = Math.max(...categorias.map((cat) => cat.id)) + 1;
    const dataAtual = new Date().toISOString().split('T')[0];

    setCategorias([
      ...categorias,
      {
        id: novoId,
        ...novaCategoria,
        dataCriacao: dataAtual,
      },
    ]);

    setNovaCategoria({ nome: '', descricao: '' });
    onClose();

    toast({
      title: 'Sucesso',
      description: 'Categoria adicionada com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNovaCategoria({
      nome: categoria.nome,
      descricao: categoria.descricao,
    });
    onOpen();
  };

  const handleSalvarEdicao = () => {
    if (!categoriaEditando) return;

    setCategorias(
      categorias.map((cat) =>
        cat.id === categoriaEditando.id
          ? {
              ...cat,
              nome: novaCategoria.nome,
              descricao: novaCategoria.descricao,
            }
          : cat
      )
    );

    setNovaCategoria({ nome: '', descricao: '' });
    setCategoriaEditando(null);
    onClose();

    toast({
      title: 'Sucesso',
      description: 'Categoria atualizada com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExcluirCategoria = (id: number) => {
    setCategorias(categorias.filter((cat) => cat.id !== id));

    toast({
      title: 'Sucesso',
      description: 'Categoria excluída com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExportCategories = () => {
    // Implementar lógica de exportação de categorias
  };

  return (
    <Box w="100%">
      <PageHeader
        title="Categorias"
        subtitle="Gerencie as categorias de produtos"
        breadcrumbs={[
          { label: 'Cadastros', href: '/cadastros' },
          { label: 'Categorias', href: '/cadastros/categorias' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportCategories}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Nova Categoria
            </Button>
          </Box>
        }
      />

      <Box mt="154px" px={6}>
        <Box maxW="1600px" mx="auto">
          <Box bg="white" p={4} rounded="md" shadow="sm">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Nome</Th>
                  <Th>Descrição</Th>
                  <Th>Data de Criação</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categorias.map((categoria) => (
                  <Tr key={categoria.id}>
                    <Td>{categoria.id}</Td>
                    <Td>{categoria.nome}</Td>
                    <Td>{categoria.descricao}</Td>
                    <Td>{categoria.dataCriacao}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<FiEdit2 />}
                          onClick={() => handleEditarCategoria(categoria)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          leftIcon={<FiTrash2 />}
                          onClick={() => handleExcluirCategoria(categoria.id)}
                        >
                          Excluir
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={novaCategoria.nome}
                  onChange={(e) =>
                    setNovaCategoria({ ...novaCategoria, nome: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Input
                  value={novaCategoria.descricao}
                  onChange={(e) =>
                    setNovaCategoria({ ...novaCategoria, descricao: e.target.value })
                  }
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={categoriaEditando ? handleSalvarEdicao : handleAdicionarCategoria}
            >
              {categoriaEditando ? 'Salvar' : 'Adicionar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
