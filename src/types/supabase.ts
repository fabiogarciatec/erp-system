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
          email: string | null
          telefone: string | null
          endereco: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          nome_completo: string
          email: string
          empresa_id: string | null
          telefone: string | null
          cargo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nome_completo: string
          email: string
          empresa_id?: string | null
          telefone?: string | null
          cargo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_completo?: string
          email?: string
          empresa_id?: string | null
          telefone?: string | null
          cargo?: string | null
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
          empresa_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          empresa_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          empresa_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface Company {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  empresa_id: string | null;
  telefone: string | null;
  cargo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa_id: string;
  created_at: string;
  updated_at: string;
}

// Interfaces de exportação para uso no projeto
export type Usuario = Database['public']['Tables']['usuarios']['Row'];
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
