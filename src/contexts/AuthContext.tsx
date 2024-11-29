import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import { Usuario } from '../types';

interface AuthContextData {
  usuario: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUserData = async (userId: string) => {
      try {
        console.log('AuthContext: Carregando dados do usuário:', userId);
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select(`
            auth_id,
            email,
            nome,
            role,
            avatar_url,
            last_login,
            created_at,
            updated_at
          `)
          .eq('auth_id', userId)
          .single();

        if (userError) {
          console.error('AuthContext: Erro ao carregar usuário:', userError);
          throw userError;
        }
        
        if (!userData) {
          console.error('AuthContext: Usuário não encontrado no banco');
          throw new Error('Usuário não encontrado');
        }

        // Mapeando apenas os campos necessários e garantindo os tipos corretos
        const mappedUser: Usuario = {
          auth_id: userData.auth_id,
          email: userData.email,
          nome: userData.nome,
          role: userData.role as 'user' | 'admin',
          avatar_url: userData.avatar_url || undefined,
          last_login: userData.last_login || undefined
        };

        console.log('AuthContext: Dados do usuário mapeados:', mappedUser);
        if (mounted) {
          setUsuario(mappedUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthContext: Erro ao carregar dados:', error);
        if (mounted) {
          setUsuario(null);
          setLoading(false);
        }
      }
    };

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext: Sessão atual:', session);
      if (session?.user && mounted) {
        loadUserData(session.user.id);
      } else {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Mudança de estado de auth:', event, session);
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUsuario(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true);
      console.log('Iniciando cadastro com email:', email);
      
      // Criar usuário no auth (o trigger vai criar na tabela usuarios)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome // Será usado pelo trigger
          }
        }
      });

      if (authError) {
        console.error('Erro no cadastro:', authError);
        if (authError.message.includes('already registered')) {
          throw new Error('Este email já está cadastrado');
        }
        throw authError;
      }

      if (!authData.user) {
        console.error('Usuário não criado no Supabase');
        throw new Error('Erro ao criar usuário');
      }

      console.log('Usuário criado com sucesso');
      toast.success('Cadastro realizado com sucesso! Por favor, verifique seu email.');
    } catch (error: any) {
      console.error('Erro completo do cadastro:', error);
      let errorMessage = 'Erro ao fazer cadastro';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('AuthContext: Iniciando login com email:', email);

      // Fazer login no auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('AuthContext: Erro no login:', authError);
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }
        throw authError;
      }

      if (!authData.user) {
        console.error('AuthContext: Usuário não encontrado');
        throw new Error('Usuário não encontrado');
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authData.user.id)
        .single();

      if (userError) {
        console.error('AuthContext: Erro ao buscar dados do usuário:', userError);
        throw userError;
      }

      if (!userData) {
        console.error('AuthContext: Dados do usuário não encontrados');
        throw new Error('Dados do usuário não encontrados');
      }

      // Atualizar last_login
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ last_login: new Date().toISOString() })
        .eq('auth_id', authData.user.id);

      if (updateError) {
        console.error('AuthContext: Erro ao atualizar last_login:', updateError);
      }

      setUsuario(userData);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('AuthContext: Erro completo do login:', error);
      let errorMessage = 'Erro ao fazer login';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Iniciando logout');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        throw error;
      }

      setUsuario(null);
      console.log('Logout realizado com sucesso');
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro completo do logout:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
