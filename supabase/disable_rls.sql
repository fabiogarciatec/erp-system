-- Desabilitar RLS (Row Level Security) para todas as tabelas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE permission_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Profiles are viewable by users in the same company" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Companies are viewable by their users" ON companies;
DROP POLICY IF EXISTS "Users can insert companies during registration" ON companies;
DROP POLICY IF EXISTS "Users can update their own company" ON companies;
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
DROP POLICY IF EXISTS "Permissions are viewable by authenticated users" ON permissions;
DROP POLICY IF EXISTS "Role permissions are viewable by authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Permission modules are viewable by authenticated users" ON permission_modules;
DROP POLICY IF EXISTS "Audit logs are viewable by super admins" ON audit_logs;

-- Garantir que o bucket de armazenamento público esteja acessível
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Garantir acesso ao storage sem RLS
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
