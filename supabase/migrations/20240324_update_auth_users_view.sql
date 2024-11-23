-- Recriar a view com as permissões corretas
DROP VIEW IF EXISTS auth_users;

CREATE VIEW auth_users AS
SELECT id, email
FROM auth.users;

-- Garantir que a view tem o owner correto
ALTER VIEW auth_users OWNER TO postgres;

-- Garantir que usuários autenticados podem selecionar da view
GRANT SELECT ON auth_users TO authenticated;

-- Habilitar RLS na view
ALTER VIEW auth_users SET (security_barrier = on);

-- Criar política de RLS para a view
DROP POLICY IF EXISTS "Users can view emails based on role and company" ON auth_users;

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
