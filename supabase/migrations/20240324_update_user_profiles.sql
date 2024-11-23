-- Add company_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_profiles' 
                  AND column_name = 'company_id') THEN
        ALTER TABLE public.user_profiles 
        ADD COLUMN company_id uuid REFERENCES public.companies(id);
    END IF;
END $$;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS user_profiles_company_id_idx ON public.user_profiles(company_id);
