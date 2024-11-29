export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          nome: string
          cnpj: string | null
          email: string | null
          telefone: string | null
          endereco: string | null
          created_at: string
          updated_at: string
          status: 'active' | 'inactive' | 'suspended'
          created_by: string | null
          logo_url: string | null
          website: string | null
          razao_social: string | null
        }
        Insert: {
          id?: string
          nome: string
          cnpj?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive' | 'suspended'
          created_by?: string | null
          logo_url?: string | null
          website?: string | null
          razao_social?: string | null
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          created_at?: string
          updated_at?: string
          status?: 'active' | 'inactive' | 'suspended'
          created_by?: string | null
          logo_url?: string | null
          website?: string | null
          razao_social?: string | null
        }
      }
      usuarios: {
        Row: {
          id: string
          auth_id: string
          email: string
          nome: string
          role: string
          avatar_url: string | null
          empresa_id: string | null
          telefone: string | null
          cargo: string | null
          departamento: string | null
          last_login: string | null
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          email: string
          nome: string
          role: string
          avatar_url?: string | null
          empresa_id?: string | null
          telefone?: string | null
          cargo?: string | null
          departamento?: string | null
          last_login?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          email?: string
          nome?: string
          role?: string
          avatar_url?: string | null
          empresa_id?: string | null
          telefone?: string | null
          cargo?: string | null
          departamento?: string | null
          last_login?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          cpf_cnpj: string | null
          endereco: Json | null
          status: 'active' | 'inactive' | 'suspended'
          tipo: 'individual' | 'corporate'
          observacoes: string | null
          ultima_compra: string | null
          created_by: string
          empresa_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          cpf_cnpj?: string | null
          endereco?: Json | null
          status?: 'active' | 'inactive' | 'suspended'
          tipo?: 'individual' | 'corporate'
          observacoes?: string | null
          ultima_compra?: string | null
          created_by: string
          empresa_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          cpf_cnpj?: string | null
          endereco?: Json | null
          status?: 'active' | 'inactive' | 'suspended'
          tipo?: 'individual' | 'corporate'
          observacoes?: string | null
          ultima_compra?: string | null
          created_by?: string
          empresa_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      produtos: {
        Row: {
          id: string
          nome: string
          codigo: string | null
          descricao: string | null
          preco: number
          estoque_atual: number
          estoque_minimo: number | null
          empresa_id: string
          fornecedor_id: string | null
          categoria: string | null
          unidade: string | null
          marca: string | null
          modelo: string | null
          imagem_url: string | null
          status: 'active' | 'inactive' | 'discontinued'
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          nome: string
          codigo?: string | null
          descricao?: string | null
          preco: number
          estoque_atual: number
          estoque_minimo?: number | null
          empresa_id: string
          fornecedor_id?: string | null
          categoria?: string | null
          unidade?: string | null
          marca?: string | null
          modelo?: string | null
          imagem_url?: string | null
          status?: 'active' | 'inactive' | 'discontinued'
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          nome?: string
          codigo?: string | null
          descricao?: string | null
          preco?: number
          estoque_atual?: number
          estoque_minimo?: number | null
          empresa_id?: string
          fornecedor_id?: string | null
          categoria?: string | null
          unidade?: string | null
          marca?: string | null
          modelo?: string | null
          imagem_url?: string | null
          status?: 'active' | 'inactive' | 'discontinued'
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
  }
}

// Interfaces de exportação para uso no projeto
export type Usuario = Database['public']['Tables']['usuarios']['Row'] & {
  empresas?: Empresa;
};

export type Empresa = Database['public']['Tables']['empresas']['Row']

export type Customer = Database['public']['Tables']['customers']['Row']

export interface Product {
  id: string;
  nome: string;
  codigo: string | null;
  descricao: string | null;
  preco: number;
  estoque_atual: number;
  estoque_minimo: number | null;
  empresa_id: string;
  fornecedor_id: string | null;
  categoria: string | null;
  unidade: string | null;
  marca: string | null;
  modelo: string | null;
  imagem_url: string | null;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Tipos para inserção
export type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert']

export type EmpresaInsert = Database['public']['Tables']['empresas']['Insert']

export type CustomerInsert = Database['public']['Tables']['customers']['Insert']

export type ProductInsert = Database['public']['Tables']['produtos']['Insert']

// Tipos para atualização
export type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update']

export type EmpresaUpdate = Database['public']['Tables']['empresas']['Update']

export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type ProductUpdate = Database['public']['Tables']['produtos']['Update']
