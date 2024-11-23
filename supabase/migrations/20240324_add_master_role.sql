-- Atualizar as políticas de RLS para permitir acesso total aos usuários master
DROP POLICY IF EXISTS "Users can view their own profile and profiles in their company" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage users in their company" ON user_profiles;
DROP POLICY IF EXISTS "Masters have full access" ON user_profiles;

-- Política para usuários master terem acesso total
CREATE POLICY "Masters have full access"
ON user_profiles FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'master'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'master'
    )
);

-- Política para usuários normais e admins
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

-- Repetir o mesmo padrão para outras tabelas (customers, services, etc)
-- Customers
DROP POLICY IF EXISTS "Masters have full access" ON customers;
CREATE POLICY "Masters have full access"
ON customers FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'master'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'master'
    )
);

-- Services
DROP POLICY IF EXISTS "Masters have full access" ON services;
CREATE POLICY "Masters have full access"
ON services FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'master'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM user_profiles 
        WHERE id = auth.uid() 
        AND role = 'master'
    )
);
