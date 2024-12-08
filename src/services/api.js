import { mockCustomers, mockProducts } from './mockData';
// Função genérica para simular delay de API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// API mockada para clientes
export const customerService = {
    getRecords: async () => {
        await delay(500); // Simula delay de rede
        return mockCustomers;
    },
    create: async (customer) => {
        await delay(500);
        const newCustomer = {
            id: String(Date.now()),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...customer,
        };
        mockCustomers.push(newCustomer);
        return newCustomer;
    },
    update: async (id, customer) => {
        await delay(500);
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index === -1)
            throw new Error('Cliente não encontrado');
        mockCustomers[index] = {
            ...mockCustomers[index],
            ...customer,
            updated_at: new Date().toISOString(),
        };
        return mockCustomers[index];
    },
    delete: async (id) => {
        await delay(500);
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index === -1)
            throw new Error('Cliente não encontrado');
        mockCustomers.splice(index, 1);
    },
};
// API mockada para produtos
export const productService = {
    getRecords: async () => {
        await delay(500);
        return mockProducts;
    },
    create: async (product) => {
        await delay(500);
        const newProduct = {
            id: String(Date.now()),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...product,
        };
        mockProducts.push(newProduct);
        return newProduct;
    },
    update: async (id, product) => {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1)
            throw new Error('Produto não encontrado');
        mockProducts[index] = {
            ...mockProducts[index],
            ...product,
            updated_at: new Date().toISOString(),
        };
        return mockProducts[index];
    },
    delete: async (id) => {
        await delay(500);
        const index = mockProducts.findIndex(p => p.id === id);
        if (index === -1)
            throw new Error('Produto não encontrado');
        mockProducts.splice(index, 1);
    },
};
