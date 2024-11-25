-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Users can view role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins have full access to role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "All users can view role permissions" ON public.role_permissions;

-- Reset RLS
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable write access for admins"
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
