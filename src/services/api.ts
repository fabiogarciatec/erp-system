import { Customer, Product } from '../types/supabase';
import { mockCustomers, mockProducts } from './mockData';

// Função genérica para simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API mockada para clientes
export const customerService = {
  getRecords: async (): Promise<Customer[]> => {
    await delay(500); // Simula delay de rede
    return mockCustomers;
  },

  create: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
    await delay(500);
    const newCustomer: Customer = {
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...customer,
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    await delay(500);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');
    
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...customer,
      updated_at: new Date().toISOString(),
    };
    return mockCustomers[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente não encontrado');
    mockCustomers.splice(index, 1);
  },
};

// API mockada para produtos
export const productService = {
  getRecords: async (): Promise<Product[]> => {
    await delay(500);
    return mockProducts;
  },

  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    await delay(500);
    const newProduct: Product = {
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...product,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Produto não encontrado');
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...product,
      updated_at: new Date().toISOString(),
    };
    return mockProducts[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Produto não encontrado');
    mockProducts.splice(index, 1);
  },
};
