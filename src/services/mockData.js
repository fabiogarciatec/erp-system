// Dados mockados de clientes
export const mockCustomers = [
    {
        id: '1',
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
        tipo: 'individual',
        cpf_cnpj: '123.456.789-00',
        endereco: {
            rua: 'Rua A',
            numero: '123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
        },
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        empresa_id: '1',
        observacoes: 'Cliente VIP',
        ultima_compra: new Date().toISOString(),
        created_by: '1'
    },
    {
        id: '2',
        nome: 'Empresa XYZ',
        email: 'contato@xyz.com',
        telefone: '(11) 3333-3333',
        tipo: 'corporate',
        cpf_cnpj: '12.345.678/0001-90',
        endereco: {
            rua: 'Av B',
            numero: '456',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '04567-890'
        },
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        empresa_id: '1',
        observacoes: 'Cliente Corporate',
        ultima_compra: new Date().toISOString(),
        created_by: '1'
    }
];
// Dados mockados de produtos
export const mockProducts = [
    {
        id: '1',
        nome: 'Produto A',
        descricao: 'Descrição do Produto A',
        preco: 99.99,
        codigo: 'PROD-001',
        categoria: 'Categoria 1',
        unidade: 'un',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        empresa_id: '1',
        estoque_atual: 100,
        estoque_minimo: 10,
        fornecedor_id: '1',
        marca: 'Marca A',
        modelo: 'Modelo A',
        imagem_url: null,
        created_by: '1'
    },
    {
        id: '2',
        nome: 'Produto B',
        descricao: 'Descrição do Produto B',
        preco: 149.99,
        codigo: 'PROD-002',
        categoria: 'Categoria 2',
        unidade: 'un',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        empresa_id: '1',
        estoque_atual: 50,
        estoque_minimo: 5,
        fornecedor_id: '2',
        marca: 'Marca B',
        modelo: 'Modelo B',
        imagem_url: null,
        created_by: '1'
    }
];
