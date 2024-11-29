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
    }
  }
}

// Interfaces de exportação para uso no projeto
export type Usuario = Database['public']['Tables']['usuarios']['Row'] & {
  empresas?: Empresa;
};

export type Empresa = Database['public']['Tables']['empresas']['Row'];

export type Customer = Database['public']['Tables']['customers']['Row'];

// Tipos para inserção
export type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert'];

export type EmpresaInsert = Database['public']['Tables']['empresas']['Insert'];

export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];

// Tipos para atualização
export type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update'];

export type EmpresaUpdate = Database['public']['Tables']['empresas']['Update'];

export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];
