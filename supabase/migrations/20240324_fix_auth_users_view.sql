-- Recriar a view com as configurações corretas
DROP VIEW IF EXISTS auth_users CASCADE;

-- Criar uma nova view sem RLS inicialmente
CREATE VIEW auth_users AS
SELECT id, email
FROM auth.users;

-- Configurar as permissões
ALTER VIEW auth_users OWNER TO postgres;
GRANT SELECT ON auth_users TO authenticated;

-- Criar uma tabela de apoio para as políticas de RLS
CREATE TABLE IF NOT EXISTS auth_users_policies (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  dummy boolean DEFAULT true
);

-- Copiar os IDs existentes
INSERT INTO auth_users_policies (id)
SELECT id FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Criar trigger para manter os IDs sincronizados
CREATE OR REPLACE FUNCTION sync_auth_users_policies()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO auth_users_policies (id) VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auth_users_sync_trigger ON auth.users;
CREATE TRIGGER auth_users_sync_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_auth_users_policies();

-- Habilitar RLS na tabela de apoio
ALTER TABLE auth_users_policies ENABLE ROW LEVEL SECURITY;

-- Criar política de RLS na tabela de apoio
DROP POLICY IF EXISTS "Users can view emails based on role and company" ON auth_users_policies;

CREATE POLICY "Users can view emails based on role and company"
ON auth_users_policies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles up 
    WHERE up.id = auth.uid() 
    AND (
      up.role = 'master' 
      OR (up.role = 'admin' AND up.company_id = (
        SELECT company_id 
        FROM user_profiles 
        WHERE id = auth_users_policies.id
      ))
      OR auth.uid() = auth_users_policies.id
    )
  )
);

-- Recriar a view para usar a tabela de apoio
DROP VIEW IF EXISTS auth_users CASCADE;
CREATE VIEW auth_users AS
SELECT au.id, au.email
FROM auth.users au
JOIN auth_users_policies aup ON au.id = aup.id;

-- Configurar as permissões finais
ALTER VIEW auth_users OWNER TO postgres;
GRANT SELECT ON auth_users TO authenticated;
