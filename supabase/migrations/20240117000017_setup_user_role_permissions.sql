DO $$
DECLARE
    v_user_role_id INTEGER;
BEGIN
    -- Get user role ID
    SELECT id INTO v_user_role_id 
    FROM public.roles 
    WHERE name = 'user';

    IF v_user_role_id IS NULL THEN
        -- Create user role if it doesn't exist
        INSERT INTO public.roles (name, description)
        VALUES ('user', 'Usuário padrão do sistema')
        RETURNING id INTO v_user_role_id;
    END IF;

    -- Delete existing permissions for user role to avoid conflicts
    DELETE FROM public.role_permissions
    WHERE role_id = v_user_role_id;

    -- Insert basic CRUD permissions for user role
    -- Users (view only)
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'users.view');

    -- Products
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'products.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'products.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'products.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'products.delete');

    -- Sales
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'sales.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'sales.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'sales.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'sales.delete');

    -- Companies (view only)
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'companies.view');

    -- Marketing
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'marketing.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'marketing.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'marketing.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_user_role_id, 'marketing.delete');

    RAISE NOTICE 'Successfully configured permissions for user role with ID: %', v_user_role_id;
END;
$$ LANGUAGE plpgsql;
