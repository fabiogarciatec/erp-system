-- Garantir que a tabela user_profiles existe
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  role TEXT NOT NULL CHECK (role IN ('master', 'admin', 'manager', 'user')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionar trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Garantir que as políticas de RLS estão corretas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para visualização
DROP POLICY IF EXISTS "Users can view profiles based on role" ON user_profiles;
CREATE POLICY "Users can view profiles based on role"
ON user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND (
      up.role = 'master' 
      OR (up.role IN ('admin', 'manager') AND up.company_id = user_profiles.company_id)
      OR auth.uid() = user_profiles.id
    )
  )
);

-- Política para inserção
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  OR 
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND (
      up.role = 'master' 
      OR (up.role = 'admin' AND up.company_id = company_id)
    )
  )
);

-- Política para atualização
DROP POLICY IF EXISTS "Users can update profiles based on role" ON user_profiles;
CREATE POLICY "Users can update profiles based on role"
ON user_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND (
      up.role = 'master' 
      OR (up.role = 'admin' AND up.company_id = user_profiles.company_id)
      OR auth.uid() = user_profiles.id
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND (
      up.role = 'master' 
      OR (up.role = 'admin' AND up.company_id = user_profiles.company_id)
      OR auth.uid() = user_profiles.id
    )
  )
);
