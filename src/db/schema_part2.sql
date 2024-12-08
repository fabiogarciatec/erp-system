-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT usuarios_email_empresa_key UNIQUE (email, empresa_id)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS usuarios_email_idx ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS usuarios_empresa_id_idx ON public.usuarios(empresa_id);
CREATE INDEX IF NOT EXISTS usuarios_auth_id_idx ON public.usuarios(auth_id);
CREATE INDEX IF NOT EXISTS empresas_cnpj_idx ON public.empresas(cnpj);
