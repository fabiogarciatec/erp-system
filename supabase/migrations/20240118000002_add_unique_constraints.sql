-- Remove duplicate roles keeping the one with most permissions
DO $$
DECLARE
    duplicate_role RECORD;
    keep_id UUID;
BEGIN
    FOR duplicate_role IN (
        SELECT name, array_agg(id) as ids
        FROM roles
        GROUP BY name
        HAVING COUNT(*) > 1
    ) LOOP
        -- Keep the role with most permissions or the oldest one if tied
        SELECT role_id INTO keep_id
        FROM (
            SELECT r.id as role_id, COUNT(rp.permission_id) as perm_count
            FROM roles r
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            WHERE r.name = duplicate_role.name
            GROUP BY r.id
            ORDER BY perm_count DESC, r.created_at ASC
            LIMIT 1
        ) sq;

        -- Update references to point to the role we're keeping
        UPDATE user_roles 
        SET role_id = keep_id 
        WHERE role_id = ANY(duplicate_role.ids) 
        AND role_id != keep_id;

        -- Delete role_permissions for duplicates
        DELETE FROM role_permissions 
        WHERE role_id = ANY(duplicate_role.ids) 
        AND role_id != keep_id;

        -- Delete duplicate roles
        DELETE FROM roles 
        WHERE name = duplicate_role.name 
        AND id != keep_id;
    END LOOP;
END $$;

-- Remove duplicate permissions keeping the one with most role assignments
DO $$
DECLARE
    duplicate_perm RECORD;
    keep_id UUID;
    r RECORD;
BEGIN
    FOR duplicate_perm IN (
        SELECT code, array_agg(id) as ids
        FROM permissions
        GROUP BY code
        HAVING COUNT(*) > 1
    ) LOOP
        -- Keep the permission with most role assignments or the oldest one if tied
        SELECT permission_id INTO keep_id
        FROM (
            SELECT p.id as permission_id, COUNT(rp.role_id) as role_count
            FROM permissions p
            LEFT JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE p.code = duplicate_perm.code
            GROUP BY p.id
            ORDER BY role_count DESC, p.created_at ASC
            LIMIT 1
        ) sq;

        -- For each role that had the duplicate permission
        FOR r IN (
            SELECT DISTINCT role_id 
            FROM role_permissions 
            WHERE permission_id = ANY(duplicate_perm.ids)
        ) LOOP
            -- Delete any existing role_permission with the kept permission
            DELETE FROM role_permissions 
            WHERE role_id = r.role_id 
            AND permission_id = keep_id;
            
            -- Insert a single role_permission with the kept permission
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES (r.role_id, keep_id);
        END LOOP;

        -- Delete remaining role_permissions for duplicates
        DELETE FROM role_permissions 
        WHERE permission_id = ANY(duplicate_perm.ids) 
        AND permission_id != keep_id;

        -- Delete duplicate permissions
        DELETE FROM permissions 
        WHERE code = duplicate_perm.code 
        AND id != keep_id;
    END LOOP;
END $$;

-- Now add the unique constraints if they don't exist
DO $$
BEGIN
    -- Add unique constraint to roles.name if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'roles_name_key'
    ) THEN
        ALTER TABLE roles
        ADD CONSTRAINT roles_name_key UNIQUE (name);
    END IF;

    -- Add unique constraint to permissions.code if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'permissions_code_key'
    ) THEN
        ALTER TABLE permissions
        ADD CONSTRAINT permissions_code_key UNIQUE (code);
    END IF;
END $$;
