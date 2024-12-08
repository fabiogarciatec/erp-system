-- Remover todas as tabelas existentes
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.empresas CASCADE;

-- Remover extensões se existirem
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Criar extensão para UUIDs
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
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    empresa_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_email_key UNIQUE (email),
    CONSTRAINT usuarios_empresa_id_fkey FOREIGN KEY (empresa_id)
        REFERENCES public.empresas(id) ON DELETE CASCADE
);

-- Criar tabela customers
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    empresa_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT customers_empresa_id_fkey FOREIGN KEY (empresa_id)
        REFERENCES public.empresas(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX idx_usuarios_empresa_id ON public.usuarios(empresa_id);
CREATE INDEX idx_customers_empresa_id ON public.customers(empresa_id);
CREATE INDEX idx_empresas_email ON public.empresas(email);
CREATE INDEX idx_usuarios_email ON public.usuarios(email);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
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
