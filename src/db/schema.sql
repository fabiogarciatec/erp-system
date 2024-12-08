-- Habilitar a extensão uuid-ossp se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Remover tabelas existentes
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.empresas CASCADE;

-- Garantir que o schema public está acessível
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Criar tabela de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    email TEXT,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em usuarios
DROP TRIGGER IF EXISTS set_updated_at ON public.usuarios;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para atualizar updated_at em empresas
DROP TRIGGER IF EXISTS set_updated_at ON public.empresas;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.empresas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (auth_id, empresa_id, email, nome, role)
    VALUES (
        NEW.id,
        'c37d9b8c-5785-4eb8-8e5f-0d8d3a3d6e4c',
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário quando auth.users for inserido
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS nas tabelas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
DROP POLICY IF EXISTS "Empresas são visíveis para usuários autenticados" ON public.empresas;
CREATE POLICY "Empresas são visíveis para usuários autenticados"
    ON public.empresas
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Usuários admin podem editar empresas" ON public.empresas;
CREATE POLICY "Usuários admin podem editar empresas"
    ON public.empresas
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Políticas para usuários
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.usuarios;
CREATE POLICY "Usuários podem ver seus próprios dados"
    ON public.usuarios
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Usuários podem editar seus próprios dados" ON public.usuarios;
CREATE POLICY "Usuários podem editar seus próprios dados"
    ON public.usuarios
    FOR UPDATE
    TO authenticated
    USING (
        auth_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON public.usuarios;
CREATE POLICY "Admins podem gerenciar todos os usuários"
    ON public.usuarios
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Garantir que as tabelas são acessíveis após a criação
GRANT ALL ON public.empresas TO authenticated;
GRANT ALL ON public.usuarios TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
