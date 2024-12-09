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
