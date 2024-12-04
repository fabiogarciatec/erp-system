-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permission_modules CASCADE;

-- Create permission_modules table
CREATE TABLE permission_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create permissions table
CREATE TABLE permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(100) REFERENCES permission_modules(code),
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(code, company_id)
);

-- Create roles table
CREATE TABLE roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create role_permissions table
CREATE TABLE role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(role_id, permission_id)
);

-- Create user_roles table
CREATE TABLE user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(user_id, role_id)
);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_permission_modules_updated_at ON permission_modules;
DROP TRIGGER IF EXISTS update_permissions_updated_at ON permissions;
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_permission_modules_updated_at
    BEFORE UPDATE ON permission_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Truncate existing data if tables already had data
TRUNCATE TABLE permission_modules CASCADE;

-- Insert default permission modules
INSERT INTO permission_modules (name, code, description) VALUES
('Sistema', 'system', 'Permissões do sistema'),
('Usuários', 'users', 'Gerenciamento de usuários'),
('Cadastros', 'registers', 'Cadastros básicos'),
('Operações', 'operations', 'Operações do sistema'),
('Relatórios', 'reports', 'Relatórios do sistema'),
('Configurações', 'settings', 'Configurações do sistema');

-- Insert default permissions
INSERT INTO permissions (name, code, description, module) VALUES
-- Sistema
('Acesso ao Sistema', 'system.access', 'Permissão para acessar o sistema', 'system'),
('Visualizar Dashboard', 'system.view_dashboard', 'Permissão para visualizar o dashboard', 'system'),

-- Usuários
('Listar Usuários', 'users.list', 'Listar todos os usuários', 'users'),
('Criar Usuários', 'users.create', 'Criar novos usuários', 'users'),
('Editar Usuários', 'users.edit', 'Editar usuários existentes', 'users'),
('Excluir Usuários', 'users.delete', 'Excluir usuários', 'users'),

-- Cadastros
('Listar Cadastros', 'registers.list', 'Listar todos os cadastros', 'registers'),
('Criar Cadastros', 'registers.create', 'Criar novos cadastros', 'registers'),
('Editar Cadastros', 'registers.edit', 'Editar cadastros existentes', 'registers'),
('Excluir Cadastros', 'registers.delete', 'Excluir cadastros', 'registers'),

-- Operações
('Listar Operações', 'operations.list', 'Listar todas as operações', 'operations'),
('Criar Operações', 'operations.create', 'Criar novas operações', 'operations'),
('Editar Operações', 'operations.edit', 'Editar operações existentes', 'operations'),
('Excluir Operações', 'operations.delete', 'Excluir operações', 'operations'),

-- Relatórios
('Visualizar Relatórios', 'reports.view', 'Visualizar relatórios', 'reports'),
('Exportar Relatórios', 'reports.export', 'Exportar relatórios', 'reports'),

-- Configurações
('Gerenciar Configurações', 'settings.manage', 'Gerenciar configurações do sistema', 'settings'),
('Gerenciar Permissões', 'settings.permissions', 'Gerenciar permissões e cargos', 'settings');

-- Insert default admin role
INSERT INTO roles (name, description, is_system_role) VALUES
('Administrador', 'Acesso completo ao sistema', TRUE);

-- Get the admin role id
DO $$ 
DECLARE 
    admin_role_id UUID;
    permission_id UUID;
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'Administrador' LIMIT 1;
    
    -- Add all permissions to admin role
    FOR permission_id IN SELECT id FROM permissions
    LOOP
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES (admin_role_id, permission_id);
    END LOOP;
END $$;
