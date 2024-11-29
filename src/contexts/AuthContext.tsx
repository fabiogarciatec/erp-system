import { createContext, useContext, ReactNode } from 'react';
import { Usuario } from '../types/supabase';

// Dados mockados do usuário
const MOCK_USER: Usuario = {
  id: '1',
  auth_id: '1',
  email: 'admin@empresa.com',
  nome: 'Administrador',
  role: 'admin',
  avatar_url: null,
  empresa_id: '1',
  telefone: null,
  cargo: 'Administrador',
  departamento: 'TI',
  last_login: new Date().toISOString(),
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  empresas: {
    id: '1',
    nome: 'Empresa Demo',
    cnpj: '00.000.000/0000-00',
    email: 'contato@empresa.com',
    telefone: '(00) 0000-0000',
    endereco: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    created_by: '1',
    logo_url: null,
    website: 'www.empresa.com',
    razao_social: 'Empresa Demo LTDA'
  }
};

interface AuthContextData {
  usuario: Usuario;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        usuario: MOCK_USER,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
