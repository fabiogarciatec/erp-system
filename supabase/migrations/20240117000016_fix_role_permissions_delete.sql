DO $$
DECLARE
    v_admin_role_id INTEGER;
BEGIN
    -- Get admin role ID
    SELECT id INTO v_admin_role_id 
    FROM public.roles 
    WHERE name = 'admin';

    IF v_admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found';
    END IF;

    -- Delete existing permissions for admin role
    DELETE FROM public.role_permissions
    WHERE role_id = v_admin_role_id;

    -- Insert permissions one by one to avoid conflicts
    -- Users
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'users.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'users.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'users.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'users.delete');

    -- Products
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'products.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'products.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'products.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'products.delete');

    -- Sales
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'sales.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'sales.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'sales.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'sales.delete');

    -- Companies
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'companies.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'companies.edit');

    -- Marketing
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'marketing.view');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'marketing.create');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'marketing.edit');
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES (v_admin_role_id, 'marketing.delete');

    RAISE NOTICE 'Successfully inserted permissions for admin role with ID: %', v_admin_role_id;
END;
$$ LANGUAGE plpgsql;
