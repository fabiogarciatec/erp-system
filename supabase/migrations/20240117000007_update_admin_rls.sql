-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles p
        JOIN public.roles r ON r.id = p.role_id
        WHERE p.id = user_id AND r.name = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profiles policies to allow admin access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    is_admin(auth.uid())
    OR auth.uid() = id
);

CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (
    is_admin(auth.uid())
    OR auth.uid() = id
);

CREATE POLICY "Admins can update profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    is_admin(auth.uid())
    OR auth.uid() = id
)
WITH CHECK (
    is_admin(auth.uid())
    OR auth.uid() = id
);

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
TO authenticated
USING (
    is_admin(auth.uid())
    AND id != auth.uid() -- Prevent admin from deleting their own profile
);
