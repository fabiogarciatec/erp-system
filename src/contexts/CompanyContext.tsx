import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { BaseRecord, GetRecordsOptions } from '../types';
import { useToast } from '@chakra-ui/react';

interface CompanyContextData {
  companyId: string | null;
  loading: boolean;
  createRecord: <T extends BaseRecord>(
    table: string,
    data: Omit<T, keyof BaseRecord>
  ) => Promise<{ data: T | null; error: Error | null }>;
  updateRecord: <T extends BaseRecord>(
    table: string,
    id: string,
    data: Partial<Omit<T, keyof BaseRecord>>
  ) => Promise<{ data: T | null; error: Error | null }>;
  deleteRecord: (
    table: string,
    id: string
  ) => Promise<{ error: Error | null }>;
  getRecords: <T extends BaseRecord>(
    table: string,
    options?: GetRecordsOptions
  ) => Promise<{ data: T[] | null; error: Error | null }>;
  getRecord: <T extends BaseRecord>(
    table: string,
    id: string
  ) => Promise<{ data: T | null; error: Error | null }>;
}

const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function loadCompanyId() {
      if (authLoading) return;
      
      if (!user) {
        setCompanyId(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('auth_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching empresa_id:', error);
          toast({
            title: 'Erro ao carregar dados da empresa',
            description: 'Por favor, tente novamente mais tarde.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (data) {
          setCompanyId(data.empresa_id);
        } else {
          console.error('No company found for user:', user.id);
          toast({
            title: 'Empresa não encontrada',
            description: 'Por favor, entre em contato com o suporte.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error in loadCompanyId:', error);
        toast({
          title: 'Erro ao carregar dados da empresa',
          description: 'Por favor, tente novamente mais tarde.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    loadCompanyId();
  }, [user, toast, authLoading]);

  const createRecord = async <T extends BaseRecord>(
    table: string,
    data: Omit<T, keyof BaseRecord>
  ) => {
    try {
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const { data: record, error } = await supabase
        .from(table)
        .insert([{ ...data, empresa_id: companyId }])
        .select()
        .single();

      if (error) throw error;

      return { data: record as T, error: null };
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      return { data: null, error: error as Error };
    }
  };

  const updateRecord = async <T extends BaseRecord>(
    table: string,
    id: string,
    data: Partial<Omit<T, keyof BaseRecord>>
  ) => {
    try {
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const { data: record, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .eq('empresa_id', companyId)
        .select()
        .single();

      if (error) throw error;

      return { data: record as T, error: null };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error: error as Error };
    }
  };

  const deleteRecord = async (table: string, id: string) => {
    try {
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('empresa_id', companyId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      return { error: error as Error };
    }
  };

  const getRecords = async <T extends BaseRecord>(
    table: string,
    options?: GetRecordsOptions
  ) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!companyId) {
        throw new Error('Company ID not found');
      }

      let query = supabase
        .from(table)
        .select('*')
        .eq('empresa_id', companyId);

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as T[], error: null };
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      return { data: null, error: error as Error };
    }
  };

  const getRecord = async <T extends BaseRecord>(
    table: string,
    id: string
  ): Promise<{ data: T | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companyId,
        loading,
        createRecord,
        updateRecord,
        deleteRecord,
        getRecords,
        getRecord,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }

  return context;
}
