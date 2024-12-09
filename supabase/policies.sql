-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para profiles
DROP POLICY IF EXISTS "Profiles are viewable by users in the same company" ON profiles;
CREATE POLICY "Profiles are viewable by users in the same company"
ON profiles FOR SELECT
TO authenticated
USING (
    company_id IN (
        SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- Política para companies
DROP POLICY IF EXISTS "Companies are viewable by their users" ON companies;
CREATE POLICY "Companies are viewable by their users"
ON companies FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert companies during registration" ON companies;
CREATE POLICY "Users can insert companies during registration"
ON companies FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own company" ON companies;
CREATE POLICY "Users can update their own company"
ON companies FOR UPDATE
TO authenticated
USING (
    id IN (
        SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    id IN (
        SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Política para roles
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
CREATE POLICY "Roles are viewable by authenticated users"
ON roles FOR SELECT
TO authenticated
USING (true);

-- Política para permissions
DROP POLICY IF EXISTS "Permissions are viewable by authenticated users" ON permissions;
CREATE POLICY "Permissions are viewable by authenticated users"
ON permissions FOR SELECT
TO authenticated
USING (true);

-- Política para role_permissions
DROP POLICY IF EXISTS "Role permissions are viewable by authenticated users" ON role_permissions;
CREATE POLICY "Role permissions are viewable by authenticated users"
ON role_permissions FOR SELECT
TO authenticated
USING (true);

-- Política para permission_modules
DROP POLICY IF EXISTS "Permission modules are viewable by authenticated users" ON permission_modules;
CREATE POLICY "Permission modules are viewable by authenticated users"
ON permission_modules FOR SELECT
TO authenticated
USING (true);

-- Política para audit_logs
DROP POLICY IF EXISTS "Audit logs are viewable by super admins" ON audit_logs;
CREATE POLICY "Audit logs are viewable by super admins"
ON audit_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles p
        JOIN roles r ON r.id = p.role_id
        WHERE p.user_id = auth.uid()
        AND r.name = 'Super Admin'
    )
);

-- Garantir que o bucket de armazenamento público esteja acessível
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir acesso público ao bucket 'public'
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'public' );

-- Política para permitir upload autenticado no bucket 'public'
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'public' );

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
