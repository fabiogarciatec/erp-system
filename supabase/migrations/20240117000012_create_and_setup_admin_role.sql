-- First ensure the admin role exists with a proper UUID
INSERT INTO public.roles (id, name, description)
VALUES 
    (gen_random_uuid(), 'admin', 'Administrador do sistema')
ON CONFLICT (name) 
DO UPDATE SET description = EXCLUDED.description
RETURNING id INTO v_admin_role_id;

-- Then insert permissions for the admin role
DO $$
DECLARE
    v_admin_role_id UUID;
BEGIN
    -- Get the admin role ID
    SELECT id INTO v_admin_role_id
    FROM public.roles
    WHERE name = 'admin';

    IF v_admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found';
    END IF;

    -- Delete existing permissions for admin role to avoid duplicates
    DELETE FROM public.role_permissions
    WHERE role_id = v_admin_role_id;
    
    -- Insert default permissions for admin
    INSERT INTO public.role_permissions (role_id, permission_key)
    VALUES
        (v_admin_role_id, 'users.view'),
        (v_admin_role_id, 'users.create'),
        (v_admin_role_id, 'users.edit'),
        (v_admin_role_id, 'users.delete'),
        (v_admin_role_id, 'products.view'),
        (v_admin_role_id, 'products.create'),
        (v_admin_role_id, 'products.edit'),
        (v_admin_role_id, 'products.delete'),
        (v_admin_role_id, 'sales.view'),
        (v_admin_role_id, 'sales.create'),
        (v_admin_role_id, 'sales.edit'),
        (v_admin_role_id, 'sales.delete'),
        (v_admin_role_id, 'companies.view'),
        (v_admin_role_id, 'companies.edit'),
        (v_admin_role_id, 'marketing.view'),
        (v_admin_role_id, 'marketing.create'),
        (v_admin_role_id, 'marketing.edit'),
        (v_admin_role_id, 'marketing.delete');

    RAISE NOTICE 'Successfully inserted permissions for admin role with ID: %', v_admin_role_id;
END;
$$ LANGUAGE plpgsql;
