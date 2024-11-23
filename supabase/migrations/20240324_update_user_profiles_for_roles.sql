-- Adicionar coluna role e active se não existirem
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_profiles' AND column_name = 'role') THEN
        ALTER TABLE user_profiles ADD COLUMN role text NOT NULL DEFAULT 'user';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_profiles' AND column_name = 'active') THEN
        ALTER TABLE user_profiles ADD COLUMN active boolean NOT NULL DEFAULT true;
    END IF;
END $$;

-- Atualizar ou criar as políticas de RLS
DROP POLICY IF EXISTS "Users can view their own profile and profiles in their company" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage users in their company" ON user_profiles;

CREATE POLICY "Users can view their own profile and profiles in their company"
ON user_profiles FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    company_id IN (
        SELECT company_id 
        FROM user_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage users in their company"
ON user_profiles FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin' 
        AND company_id = user_profiles.company_id
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'admin' 
        AND company_id = user_profiles.company_id
    )
);
