import { Customer, Product } from '../types/supabase';

// Dados mockados de clientes
export const mockCustomers: Customer[] = [
  {
    id: '1',
    nome: 'Cliente A',
    email: 'clienteA@email.com',
    telefone: '(11) 99999-9999',
    tipo: 'individual' as const,
    cpf_cnpj: '123.456.789-00',
    endereco: {
      rua: 'Rua A',
      numero: '123',
      bairro: 'Bairro A',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    },
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    observacoes: '',
    ultima_compra: null,
    created_by: '1',
    empresa_id: '1'
  },
  {
    id: '2',
    nome: 'Empresa B',
    email: 'empresaB@email.com',
    telefone: '(11) 3333-3333',
    tipo: 'corporate' as const,
    cpf_cnpj: '12.345.678/0001-90',
    endereco: {
      rua: 'Av B',
      numero: '456',
      bairro: 'Bairro B',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04567-890'
    },
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    observacoes: '',
    ultima_compra: null,
    created_by: '1',
    empresa_id: '1'
  }
];

// Dados mockados de produtos
export const mockProducts: Product[] = [
  {
    id: '1',
    nome: 'Produto 1',
    descricao: 'Descrição do produto 1',
    preco: 100,
    codigo: 'PROD001',
    categoria: 'Categoria 1',
    unidade: 'UN',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    empresa_id: '1',
    estoque_atual: 10,
    estoque_minimo: 5,
    fornecedor_id: '1',
    marca: 'Marca 1',
    modelo: 'Modelo 1',
    imagem_url: '',
    created_by: '1'
  },
  {
    id: '2',
    nome: 'Produto 2',
    descricao: 'Descrição do produto 2',
    preco: 200,
    codigo: 'PROD002',
    categoria: 'Categoria 2',
    unidade: 'UN',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    empresa_id: '1',
    estoque_atual: 20,
    estoque_minimo: 10,
    fornecedor_id: '2',
    marca: 'Marca 2',
    modelo: 'Modelo 2',
    imagem_url: '',
    created_by: '1'
  }
];
