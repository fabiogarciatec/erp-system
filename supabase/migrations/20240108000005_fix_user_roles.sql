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

COMMIT;
