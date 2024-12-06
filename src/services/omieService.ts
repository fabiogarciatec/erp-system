import axios from 'axios';

export interface OmieCustomer {
  razao_social: string;
  cnpj_cpf: string;
  email: string;
  telefone1_ddd: string;
  telefone1_numero: string;
  cidade: string;
  estado: string;
  codigo_cliente_omie?: string;
  status_cliente?: string;
}

interface OmieResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface OmieListResponse {
  clientes_cadastro: OmieCustomer[];
  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
}

const api = axios.create({
  baseURL: '/api'
});

export const omieService = {
  async listCustomers(page: number = 1, pageSize: number = 50): Promise<OmieResponse<OmieListResponse>> {
    try {
      const response = await api.get<OmieResponse<OmieListResponse>>('/clientes', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return {
        success: false,
        error: 'Erro ao buscar clientes da Omie'
      };
    }
  },

  async searchCustomers(query: string): Promise<OmieResponse<OmieListResponse>> {
    try {
      const response = await api.get<OmieResponse<OmieListResponse>>('/clientes/busca', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return {
        success: false,
        error: 'Erro ao buscar clientes da Omie'
      };
    }
  }
};
