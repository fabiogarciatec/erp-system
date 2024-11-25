-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Users can view role permissions" ON public.role_permissions;

-- Create policies for role_permissions table
CREATE POLICY "Admins can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid() AND r.name = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = auth.uid() AND r.name = 'admin'
    )
);

-- Allow all authenticated users to view role permissions
CREATE POLICY "Users can view role permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.role_permissions TO authenticated;
