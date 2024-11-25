DO $$
DECLARE
    v_admin_role_id INTEGER;
BEGIN
    -- Ensure admin role exists
    INSERT INTO public.roles (name, description)
    VALUES 
        ('admin', 'Administrador do sistema')
    ON CONFLICT (name) 
    DO UPDATE SET description = EXCLUDED.description
    RETURNING id INTO v_admin_role_id;

    -- If we didn't get the id from the INSERT/UPDATE, get it directly
    IF v_admin_role_id IS NULL THEN
        SELECT id INTO v_admin_role_id
        FROM public.roles
        WHERE name = 'admin';
    END IF;

    IF v_admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found';
    END IF;

    -- Insert default permissions for admin with ON CONFLICT DO NOTHING
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
        (v_admin_role_id, 'marketing.delete')
    ON CONFLICT (role_id, permission_key) DO NOTHING;

    RAISE NOTICE 'Successfully inserted permissions for admin role with ID: %', v_admin_role_id;
END;
$$ LANGUAGE plpgsql;
