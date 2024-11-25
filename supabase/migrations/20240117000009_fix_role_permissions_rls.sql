-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Users can view role permissions" ON public.role_permissions;

-- Create new policy for admins
CREATE POLICY "Admins have full access to role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid() AND r.name = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid() AND r.name = 'admin'
    )
);

-- Create new policy for users to view permissions
CREATE POLICY "All users can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

-- Reset RLS
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Ensure proper grants
GRANT ALL ON public.role_permissions TO authenticated;

-- Insert default permissions for admin role if not exists
DO $$
DECLARE
    admin_role_id UUID;
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
    
    -- Insert default permissions for admin
    INSERT INTO public.role_permissions (role_id, permission_key)
    VALUES
        (admin_role_id, 'users.view'),
        (admin_role_id, 'users.create'),
        (admin_role_id, 'users.edit'),
        (admin_role_id, 'users.delete'),
        (admin_role_id, 'products.view'),
        (admin_role_id, 'products.create'),
        (admin_role_id, 'products.edit'),
        (admin_role_id, 'products.delete'),
        (admin_role_id, 'sales.view'),
        (admin_role_id, 'sales.create'),
        (admin_role_id, 'sales.edit'),
        (admin_role_id, 'sales.delete'),
        (admin_role_id, 'companies.view'),
        (admin_role_id, 'companies.edit'),
        (admin_role_id, 'marketing.view'),
        (admin_role_id, 'marketing.create'),
        (admin_role_id, 'marketing.edit'),
        (admin_role_id, 'marketing.delete')
    ON CONFLICT (role_id, permission_key) DO NOTHING;
END $$;
