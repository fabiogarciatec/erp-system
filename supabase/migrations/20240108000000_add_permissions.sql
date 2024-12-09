-- Criar tabela de módulos de permissão se não existir
CREATE TABLE IF NOT EXISTS permission_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verificar se a tabela permissions existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'permissions') THEN
        -- Criar tabela de permissões se não existir
        CREATE TABLE permissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Verificar e ajustar a estrutura da tabela permissions
DO $$ 
BEGIN
    -- Adicionar colunas necessárias se não existirem
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'permissions' AND column_name = 'module') THEN
        ALTER TABLE permissions ADD COLUMN module VARCHAR(50);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'permissions' AND column_name = 'code') THEN
        ALTER TABLE permissions ADD COLUMN code VARCHAR(50);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'permissions' AND column_name = 'name') THEN
        ALTER TABLE permissions ADD COLUMN name VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'permissions' AND column_name = 'description') THEN
        ALTER TABLE permissions ADD COLUMN description TEXT;
    END IF;

    -- Adicionar restrição UNIQUE para code se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'permissions' 
        AND constraint_name = 'permissions_code_key'
    ) THEN
        -- Remover duplicatas antes de adicionar a restrição
        DELETE FROM permissions a USING permissions b
        WHERE a.id > b.id AND a.code = b.code;
        
        ALTER TABLE permissions ADD CONSTRAINT permissions_code_key UNIQUE (code);
    END IF;
END $$;

-- Verificar se a tabela role_permissions existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'role_permissions') THEN
        CREATE TABLE role_permissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
            permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(role_id, permission_id)
        );
    END IF;
END $$;

-- Desabilitar RLS nas tabelas
ALTER TABLE permission_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;

-- Inserir módulos básicos se não existirem
INSERT INTO permission_modules (name, description)
VALUES
    ('Users', 'Gerenciamento de usuários'),
    ('Roles', 'Gerenciamento de papéis e permissões')
ON CONFLICT (name) DO NOTHING;

-- Inserir ou atualizar permissões
DO $$ 
BEGIN
    -- Remover registros antigos que possam ter valores nulos
    DELETE FROM permissions WHERE module IS NULL OR code IS NULL OR name IS NULL;

    -- Inserir permissões básicas
    INSERT INTO permissions (module, code, name, description)
    VALUES
        ('Users', 'USERS_VIEW', 'Visualizar Usuários', 'Permite visualizar a lista de usuários'),
        ('Users', 'USERS_CREATE', 'Criar Usuários', 'Permite criar novos usuários'),
        ('Users', 'USERS_EDIT', 'Editar Usuários', 'Permite editar usuários existentes'),
        ('Users', 'USERS_DELETE', 'Excluir Usuários', 'Permite excluir usuários'),
        ('Roles', 'ROLES_VIEW', 'Visualizar Papéis', 'Permite visualizar a lista de papéis'),
        ('Roles', 'ROLES_CREATE', 'Criar Papéis', 'Permite criar novos papéis'),
        ('Roles', 'ROLES_EDIT', 'Editar Papéis', 'Permite editar papéis existentes'),
        ('Roles', 'ROLES_DELETE', 'Excluir Papéis', 'Permite excluir papéis')
    ON CONFLICT (code) DO UPDATE 
    SET module = EXCLUDED.module,
        name = EXCLUDED.name,
        description = EXCLUDED.description;

    -- Tornar colunas NOT NULL após inserção dos dados
    ALTER TABLE permissions ALTER COLUMN module SET NOT NULL;
    ALTER TABLE permissions ALTER COLUMN code SET NOT NULL;
    ALTER TABLE permissions ALTER COLUMN name SET NOT NULL;
END $$;

-- Função para atribuir todas as permissões ao Super Admin
CREATE OR REPLACE FUNCTION assign_all_permissions_to_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_super_admin_id UUID;
BEGIN
    -- Obter o ID do papel Super Admin
    SELECT id INTO v_super_admin_id FROM roles WHERE name = 'Super Admin';
    
    -- Atribuir todas as permissões ao Super Admin
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_super_admin_id, id
    FROM permissions
    ON CONFLICT (role_id, permission_id) DO NOTHING;
END;
$$;
