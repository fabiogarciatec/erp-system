-- Primeiro, remover todas as políticas RLS existentes
DO $$ 
DECLARE 
    _tbl text;
    _pol text;
BEGIN
    FOR _tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        -- Desabilitar RLS
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', _tbl);
        
        -- Remover todas as políticas
        FOR _pol IN (
            SELECT policyname 
            FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = _tbl
        )
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', _pol, _tbl);
        END LOOP;
    END LOOP;
END $$;

-- Remover todas as tabelas existentes
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.empresas CASCADE;

-- Remover todas as funções
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS exec_sql() CASCADE;

-- Remover extensões
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Recriar tudo do zero
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela empresas
CREATE TABLE public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT empresas_email_key UNIQUE (email)
);

-- Criar tabela usuarios
CREATE TABLE public.usuarios (
    auth_id UUID PRIMARY KEY,
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_email_key UNIQUE (email)
);

-- Criar tabela customers
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_usuarios_empresa_id ON public.usuarios(empresa_id);
CREATE INDEX idx_customers_empresa_id ON public.customers(empresa_id);
CREATE INDEX idx_empresas_email ON public.empresas(email);
CREATE INDEX idx_usuarios_email ON public.usuarios(email);

-- Criar função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar o updated_at
CREATE TRIGGER update_empresas_updated_at
    BEFORE UPDATE ON public.empresas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Criar função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
RETURNS void AS $$
BEGIN
    EXECUTE sql_string;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
