-- Create admin role if it doesn't exist
INSERT INTO public.roles (name, description)
VALUES ('admin', 'Administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Get the admin role ID and set up admin permissions
DO $$ 
DECLARE
    v_admin_role_id INTEGER;
BEGIN
    -- Get admin role ID
    SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'admin';
    
    -- Insert admin permissions
    INSERT INTO public.role_permissions (role_id, permission_key)
    VALUES 
        -- User Management
        (v_admin_role_id, 'users.view'),
        (v_admin_role_id, 'users.create'),
        (v_admin_role_id, 'users.edit'),
        (v_admin_role_id, 'users.delete'),
        -- Products
        (v_admin_role_id, 'products.view'),
        (v_admin_role_id, 'products.create'),
        (v_admin_role_id, 'products.edit'),
        (v_admin_role_id, 'products.delete'),
        -- Sales
        (v_admin_role_id, 'sales.view'),
        (v_admin_role_id, 'sales.create'),
        (v_admin_role_id, 'sales.edit'),
        (v_admin_role_id, 'sales.delete'),
        -- Companies
        (v_admin_role_id, 'companies.view'),
        (v_admin_role_id, 'companies.edit'),
        -- Marketing
        (v_admin_role_id, 'marketing.view'),
        (v_admin_role_id, 'marketing.create'),
        (v_admin_role_id, 'marketing.edit'),
        (v_admin_role_id, 'marketing.delete')
    ON CONFLICT (role_id, permission_key) DO NOTHING;
END $$;
