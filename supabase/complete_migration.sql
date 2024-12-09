-- Primeiro, limpar todas as tabelas existentes
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS permission_modules CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Criar tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    address_number VARCHAR(10),
    address_complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state_id UUID,
    postal_code VARCHAR(8),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    logo_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de papéis (roles)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users ON DELETE CASCADE,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    role_id UUID REFERENCES roles(id),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar papel Super Admin se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Super Admin') THEN
        INSERT INTO roles (name, description)
        VALUES ('Super Admin', 'Administrador com acesso total ao sistema');
    END IF;
END $$;

-- Tabela de módulos de permissão
CREATE TABLE IF NOT EXISTS permission_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de permissões
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL REFERENCES permission_modules(name),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de permissões por papel
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Inserir módulos padrão
INSERT INTO permission_modules (name, description) VALUES
    ('Dashboard', 'Módulo de Dashboard'),
    ('Usuários', 'Gerenciamento de usuários'),
    ('Papéis', 'Gerenciamento de papéis'),
    ('Permissões', 'Gerenciamento de permissões'),
    ('Empresas', 'Gerenciamento de empresas')
ON CONFLICT (name) DO NOTHING;

-- Inserir permissões padrão
INSERT INTO permissions (code, name, description, module) VALUES
    ('DASHBOARD', 'dashboard', 'Acesso ao Dashboard', 'Dashboard'),
    ('USERS_VIEW', 'users_view', 'Visualizar usuários', 'Usuários'),
    ('USERS_CREATE', 'users_create', 'Criar usuários', 'Usuários'),
    ('USERS_EDIT', 'users_edit', 'Editar usuários', 'Usuários'),
    ('USERS_DELETE', 'users_delete', 'Excluir usuários', 'Usuários'),
    ('ROLES_VIEW', 'roles_view', 'Visualizar papéis', 'Papéis'),
    ('ROLES_CREATE', 'roles_create', 'Criar papéis', 'Papéis'),
    ('ROLES_EDIT', 'roles_edit', 'Editar papéis', 'Papéis'),
    ('ROLES_DELETE', 'roles_delete', 'Excluir papéis', 'Papéis'),
    ('PERMISSIONS_VIEW', 'permissions_view', 'Visualizar permissões', 'Permissões'),
    ('PERMISSIONS_EDIT', 'permissions_edit', 'Editar permissões', 'Permissões'),
    ('COMPANIES_VIEW', 'companies_view', 'Visualizar empresas', 'Empresas'),
    ('COMPANIES_CREATE', 'companies_create', 'Criar empresas', 'Empresas'),
    ('COMPANIES_EDIT', 'companies_edit', 'Editar empresas', 'Empresas'),
    ('COMPANIES_DELETE', 'companies_delete', 'Excluir empresas', 'Empresas')
ON CONFLICT (code) DO NOTHING;

-- Dar todas as permissões para o Super Admin
WITH super_admin_role AS (
    SELECT id FROM roles WHERE name = 'Super Admin' LIMIT 1
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT super_admin_role.id, permissions.id
FROM super_admin_role, permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Função para atualizar função do usuário com validações apropriadas
CREATE OR REPLACE FUNCTION update_user_role(
    p_target_user_id UUID,
    p_new_role_id UUID,
    p_admin_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_admin_role_name VARCHAR;
    v_target_role_name VARCHAR;
    v_result JSONB;
BEGIN
    -- Verifica se o usuário admin é Super Admin
    SELECT r.name INTO v_admin_role_name
    FROM profiles p
    JOIN roles r ON r.id = p.role_id
    WHERE p.user_id = p_admin_user_id;

    -- Se não for Super Admin, bloqueia a operação
    IF v_admin_role_name IS NULL OR v_admin_role_name != 'Super Admin' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Apenas Super Admin pode alterar funções de usuários'
        );
    END IF;

    -- Verifica se o usuário está tentando alterar seu próprio papel
    IF p_target_user_id = p_admin_user_id THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Super Admin não pode alterar sua própria função'
        );
    END IF;

    -- Verifica se o papel de destino existe
    SELECT name INTO v_target_role_name
    FROM roles
    WHERE id = p_new_role_id;

    IF v_target_role_name IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Função de usuário inválida'
        );
    END IF;

    -- Atualiza a função do usuário
    UPDATE profiles
    SET role_id = p_new_role_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_target_user_id;

    -- Cria log de auditoria
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        created_at
    )
    VALUES (
        p_admin_user_id,
        'update_role',
        'profiles',
        p_target_user_id,
        (SELECT jsonb_build_object(
            'role_id', role_id,
            'role_name', (SELECT name FROM roles WHERE id = role_id)
        ) FROM profiles WHERE user_id = p_target_user_id),
        jsonb_build_object(
            'role_id', p_new_role_id,
            'role_name', v_target_role_name
        ),
        CURRENT_TIMESTAMP
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Função do usuário atualizada com sucesso'
    );
END;
$$;

-- Drop da função existente se ela existir
DROP FUNCTION IF EXISTS clean_user_data(UUID);

-- Função para limpar dados de um usuário
CREATE OR REPLACE FUNCTION clean_user_data(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_id UUID;
BEGIN
    -- Busca o ID da empresa do usuário
    SELECT company_id INTO v_company_id
    FROM profiles
    WHERE user_id = p_user_id;

    -- Se encontrou uma empresa, remove todos os dados relacionados
    IF v_company_id IS NOT NULL THEN
        -- Remove registros da empresa
        DELETE FROM companies WHERE id = v_company_id;
    END IF;

    -- Remove o perfil do usuário
    DELETE FROM profiles WHERE user_id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Dados do usuário limpos com sucesso'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_detail', SQLSTATE
        );
END;
$$;

-- Função para criar um usuário completo com empresa e permissões
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id UUID,
    p_email VARCHAR,
    p_company_name VARCHAR,
    p_company_document VARCHAR,
    p_company_email VARCHAR DEFAULT NULL,
    p_company_phone VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_id UUID;
    v_super_admin_role_id UUID;
    v_debug_info JSONB;
BEGIN
    -- Inicializa o objeto de debug
    v_debug_info := jsonb_build_object(
        'stage', 'start',
        'user_id', p_user_id,
        'email', p_email
    );

    -- Verifica se o usuário já existe
    IF EXISTS (SELECT 1 FROM profiles WHERE user_id = p_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Usuário já existe',
            'error_detail', 'PROFILE_EXISTS',
            'debug_info', v_debug_info
        );
    END IF;

    -- Inicia uma transação
    BEGIN
        -- Cria a empresa
        INSERT INTO companies (
            name,
            document,
            email,
            phone
        ) VALUES (
            p_company_name,
            p_company_document,
            p_company_email,
            p_company_phone
        )
        RETURNING id INTO v_company_id;

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'company_created',
            'company_id', v_company_id
        );

        -- Busca o papel Super Admin
        SELECT id INTO v_super_admin_role_id
        FROM roles
        WHERE name = 'Super Admin';

        IF v_super_admin_role_id IS NULL THEN
            -- Se não existir, cria o papel Super Admin
            INSERT INTO roles (name, description)
            VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
            RETURNING id INTO v_super_admin_role_id;
        END IF;

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'role_found',
            'role_id', v_super_admin_role_id
        );

        -- Cria o perfil do usuário
        INSERT INTO profiles (
            user_id,
            email,
            role_id,
            company_id
        ) VALUES (
            p_user_id,
            p_email,
            v_super_admin_role_id,
            v_company_id
        );

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'profile_created'
        );

        -- Garante que o Super Admin tenha todas as permissões
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT v_super_admin_role_id, id
        FROM permissions
        ON CONFLICT (role_id, permission_id) DO NOTHING;

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'permissions_assigned'
        );

        -- Retorna sucesso
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Usuário criado com sucesso',
            'debug_info', v_debug_info,
            'data', jsonb_build_object(
                'user_id', p_user_id,
                'company_id', v_company_id,
                'role_id', v_super_admin_role_id
            )
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Em caso de erro, retorna informações detalhadas
            RETURN jsonb_build_object(
                'success', false,
                'error', SQLERRM,
                'error_detail', SQLSTATE,
                'debug_info', v_debug_info || jsonb_build_object(
                    'stage', 'error',
                    'error_message', SQLERRM,
                    'error_state', SQLSTATE
                )
            );
    END;
END;
$$;
