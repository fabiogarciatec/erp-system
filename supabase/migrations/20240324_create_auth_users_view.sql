-- Criar view para acessar emails dos usuários de forma segura
CREATE OR REPLACE VIEW auth_users AS
SELECT id, email
FROM auth.users;

-- Garantir que apenas usuários autenticados podem acessar a view
ALTER VIEW auth_users OWNER TO authenticated;

-- Criar política de RLS para a view
CREATE POLICY "Users can view emails based on role and company"
ON auth_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND (
      -- Usuário master pode ver todos os emails
      up.role = 'master' 
      OR 
      -- Admin pode ver emails da mesma empresa
      (up.role = 'admin' AND up.company_id = (
        SELECT company_id 
        FROM user_profiles 
        WHERE id = id
      ))
      OR
      -- Usuário pode ver seu próprio email
      auth.uid() = id
    )
  )
);
