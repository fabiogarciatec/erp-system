import supabase from '@/lib/supabase';

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

export const omieService = {
  async listCustomers(page: number = 1, pageSize: number = 50): Promise<OmieResponse<OmieListResponse>> {
    try {
      const { data, error } = await supabase
        .from('omie_clientes')
        .select('*')
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      return {
        success: true,
        data: {
          clientes_cadastro: data,
          pagina: page,
          total_de_paginas: Math.ceil((data?.length || 0) / pageSize),
          registros: data?.length || 0,
          total_de_registros: data?.length || 0
        }
      };
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
      const { data, error } = await supabase
        .from('omie_clientes')
        .select('*')
        .or(`razao_social.ilike.%${query}%,cnpj_cpf.ilike.%${query}%,cidade.ilike.%${query}%`);

      if (error) throw error;

      return {
        success: true,
        data: {
          clientes_cadastro: data,
          pagina: 1,
          total_de_paginas: 1,
          registros: data?.length || 0,
          total_de_registros: data?.length || 0
        }
      };
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      return {
        success: false,
        error: 'Erro ao buscar clientes da Omie'
      };
    }
  }
};
