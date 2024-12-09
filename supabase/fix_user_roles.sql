-- Fix user_roles and role_permissions tables
BEGIN;

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS user_roles 
    DROP CONSTRAINT IF EXISTS ur_user_fkey,
    DROP CONSTRAINT IF EXISTS ur_role_fkey;

ALTER TABLE IF EXISTS role_permissions
    DROP CONSTRAINT IF EXISTS rp_role_fkey,
    DROP CONSTRAINT IF EXISTS rp_permission_fkey;

-- Recreate foreign key constraints with correct references
ALTER TABLE user_roles
    ADD CONSTRAINT ur_user_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    ADD CONSTRAINT ur_role_fkey
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE;

ALTER TABLE role_permissions
    ADD CONSTRAINT rp_role_fkey
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    ADD CONSTRAINT rp_permission_fkey
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE;

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Ensure tables have correct structure
DO $$ 
BEGIN
    -- Check if user_roles table exists and create if not
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
        CREATE TABLE user_roles (
            id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now(),
            UNIQUE(user_id, role_id)
        );
    END IF;

    -- Check if role_permissions table exists and create if not
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'role_permissions') THEN
        CREATE TABLE role_permissions (
            id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
            role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
            permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now(),
            UNIQUE(role_id, permission_id)
        );
    END IF;
END $$;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_roles;
    DROP POLICY IF EXISTS "Enable write access for super admin" ON user_roles;
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON role_permissions;
    DROP POLICY IF EXISTS "Enable write access for super admin" ON role_permissions;

    -- Create new policies
    CREATE POLICY "Enable read access for authenticated users"
        ON user_roles FOR SELECT
        TO authenticated
        USING (true);

    CREATE POLICY "Enable write access for super admin"
        ON user_roles FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = auth.uid()
                AND r.name = 'Super Admin'
            )
        );

    CREATE POLICY "Enable read access for authenticated users"
        ON role_permissions FOR SELECT
        TO authenticated
        USING (true);

    CREATE POLICY "Enable write access for super admin"
        ON role_permissions FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = auth.uid()
                AND r.name = 'Super Admin'
            )
        );
END $$;

COMMIT;
