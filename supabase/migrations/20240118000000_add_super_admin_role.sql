-- Create Super Admin role if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Super Admin') THEN
        INSERT INTO roles (name, description, is_system_role)
        VALUES ('Super Admin', 'Acesso total ao sistema com permissões especiais', TRUE);
    END IF;
END $$;

-- Add special permission for managing Super Admins if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM permissions WHERE code = 'users.manage_super_admin') THEN
        INSERT INTO permissions (name, code, description, module)
        VALUES ('Gerenciar Super Admins', 'users.manage_super_admin', 'Gerenciar usuários Super Admin', 'users');
    END IF;
END $$;

-- Get the Super Admin role id and the new permission id
DO $$ 
DECLARE 
    super_admin_role_id UUID;
    super_admin_permission_id UUID;
    perm_id UUID;
BEGIN
    -- Get the Super Admin role id
    SELECT id INTO super_admin_role_id FROM roles WHERE name = 'Super Admin' LIMIT 1;
    
    -- Get the Super Admin management permission id
    SELECT id INTO super_admin_permission_id 
    FROM permissions 
    WHERE code = 'users.manage_super_admin' 
    LIMIT 1;
    
    -- Add all existing permissions to Super Admin role
    FOR perm_id IN SELECT id FROM permissions
    LOOP
        BEGIN
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES (super_admin_role_id, perm_id);
        EXCEPTION WHEN unique_violation THEN
            -- Ignore if already exists
        END;
    END LOOP;
END $$;

-- Create function to assign Super Admin role during company registration
CREATE OR REPLACE FUNCTION assign_super_admin_role()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_role_id UUID;
BEGIN
    -- Get Super Admin role id
    SELECT id INTO super_admin_role_id FROM roles WHERE name = 'Super Admin' LIMIT 1;
    
    -- Assign Super Admin role to the user who created the company
    BEGIN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (NEW.owner_id, super_admin_role_id);
    EXCEPTION WHEN unique_violation THEN
        -- Ignore if already exists
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically assign Super Admin role when a company is created
DROP TRIGGER IF EXISTS assign_super_admin_on_company_creation ON companies;
CREATE TRIGGER assign_super_admin_on_company_creation
    AFTER INSERT ON companies
    FOR EACH ROW
    EXECUTE FUNCTION assign_super_admin_role();

-- Drop existing function before recreating
DROP FUNCTION IF EXISTS create_user_complete(UUID, TEXT, TEXT, TEXT, TEXT, TEXT);

-- Update the create_user_complete function to handle Super Admin assignment
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id UUID,
    p_email TEXT,
    p_company_name TEXT,
    p_company_document TEXT,
    p_company_email TEXT,
    p_company_phone TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_company_id UUID;
    v_super_admin_role_id UUID;
BEGIN
    -- Get Super Admin role id first
    SELECT id INTO v_super_admin_role_id FROM roles WHERE name = 'Super Admin' LIMIT 1;
    
    -- Create company with owner_id
    INSERT INTO companies (name, document, email, phone, owner_id)
    VALUES (p_company_name, p_company_document, p_company_email, p_company_phone, p_user_id)
    RETURNING id INTO v_company_id;

    -- Create profile
    INSERT INTO profiles (id, email, company_id)
    VALUES (p_user_id, p_email, v_company_id);

    -- Create company relationship
    INSERT INTO user_companies (user_id, company_id, is_owner)
    VALUES (p_user_id, v_company_id, true);

    -- Assign Super Admin role
    BEGIN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (p_user_id, v_super_admin_role_id);
    EXCEPTION WHEN unique_violation THEN
        -- Ignore if already exists
    END;

    RETURN jsonb_build_object(
        'success', true,
        'company_id', v_company_id
    );
EXCEPTION WHEN OTHERS THEN
    -- Log the error details
    RAISE NOTICE 'Error creating user: % %', SQLERRM, SQLSTATE;
    
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'error_detail', SQLSTATE
    );
END;
$$ LANGUAGE plpgsql;
