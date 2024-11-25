-- First, let's see the current users
SELECT id, email, raw_user_meta_data
FROM auth.users;

-- After you find your user ID, uncomment and update the following:
/*
DO $$ 
DECLARE
    v_admin_role_id INTEGER;
    v_user_id UUID := 'YOUR-USER-ID-HERE'; -- Replace with your user ID
BEGIN
    -- Get admin role ID
    SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'admin';
    
    -- Create profile if it doesn't exist
    INSERT INTO public.profiles (id, email, full_name, role_id)
    SELECT 
        v_user_id,
        (SELECT email FROM auth.users WHERE id = v_user_id),
        (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = v_user_id),
        v_admin_role_id
    ON CONFLICT (id) DO UPDATE 
    SET role_id = v_admin_role_id;
END $$;
*/
