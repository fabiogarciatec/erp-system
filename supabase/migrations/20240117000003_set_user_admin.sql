-- Set user as admin (replace YOUR_USER_ID with the actual ID)
DO $$ 
DECLARE
    v_admin_role_id UUID;
BEGIN
    -- Get admin role ID
    SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'admin';
    
    -- Update the user's profile with admin role
    UPDATE public.profiles 
    SET role_id = v_admin_role_id
    WHERE id = 'YOUR_USER_ID'::uuid;
END $$;
