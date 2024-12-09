-- Fix policies to avoid infinite recursion
BEGIN;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable write access for super admin" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Enable write access for super admin" ON role_permissions;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Super admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admin can update all profiles" ON profiles;

-- Create basic RLS policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id
        AND r.name = 'Super Admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for user_roles
CREATE POLICY "Anyone can read user roles"
    ON user_roles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Super admin can manage user roles"
    ON user_roles FOR ALL
    TO authenticated
    USING (is_super_admin(auth.uid()));

-- Create RLS policies for role_permissions
CREATE POLICY "Anyone can read role permissions"
    ON role_permissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Super admin can manage role permissions"
    ON role_permissions FOR ALL
    TO authenticated
    USING (is_super_admin(auth.uid()));

-- Create RLS policies for super admin access to profiles
CREATE POLICY "Super admin can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admin can update all profiles"
    ON profiles FOR UPDATE
    TO authenticated
    USING (is_super_admin(auth.uid()));

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_super_admin TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin TO anon;
GRANT EXECUTE ON FUNCTION is_super_admin TO service_role;

COMMIT;
