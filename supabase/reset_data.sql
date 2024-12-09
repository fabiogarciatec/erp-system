-- Reset and initialize basic data
BEGIN;

-- Clear existing data
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE role_permissions CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Create Super Admin role if it doesn't exist
INSERT INTO roles (name, description)
VALUES ('Super Admin', 'Full system access')
ON CONFLICT (name) DO NOTHING;

-- Create default User role if it doesn't exist
INSERT INTO roles (name, description)
VALUES ('User', 'Basic system access')
ON CONFLICT (name) DO NOTHING;

-- Get role IDs
DO $$ 
DECLARE
    v_super_admin_id uuid;
    v_user_id uuid;
BEGIN
    SELECT id INTO v_super_admin_id FROM roles WHERE name = 'Super Admin';
    SELECT id INTO v_user_id FROM roles WHERE name = 'User';

    -- Create basic permissions if they don't exist
    INSERT INTO permissions (code, name, description, module)
    VALUES 
        ('USERS_VIEW', 'View Users', 'Can view users', 'users'),
        ('USERS_MANAGE', 'Manage Users', 'Can manage users', 'users'),
        ('ROLES_VIEW', 'View Roles', 'Can view roles', 'roles'),
        ('ROLES_MANAGE', 'Manage Roles', 'Can manage roles', 'roles')
    ON CONFLICT (code) DO NOTHING;

    -- Assign all permissions to Super Admin
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_super_admin_id, id
    FROM permissions
    ON CONFLICT DO NOTHING;

    -- Assign basic permissions to User role
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_user_id, id
    FROM permissions
    WHERE code IN ('USERS_VIEW', 'ROLES_VIEW')
    ON CONFLICT DO NOTHING;

END $$;

COMMIT;
