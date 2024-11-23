-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Create new policies without recursion
CREATE POLICY "Enable read access for authenticated users"
ON public.user_profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for users based on id"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
