-- Create default user role if it doesn't exist
INSERT INTO public.roles (name, description)
VALUES ('user', 'Regular user with basic access')
ON CONFLICT (name) DO NOTHING;

-- Get the user role ID and set up basic permissions
DO $$ 
DECLARE
    v_user_role_id INTEGER;
BEGIN
    -- Get user role ID
    SELECT id INTO v_user_role_id FROM public.roles WHERE name = 'user';
    
    -- Insert basic user permissions
    INSERT INTO public.role_permissions (role_id, permission_key)
    VALUES 
        (v_user_role_id, 'users.view'),
        (v_user_role_id, 'products.view'),
        (v_user_role_id, 'sales.view')
    ON CONFLICT (role_id, permission_key) DO NOTHING;
END $$;
