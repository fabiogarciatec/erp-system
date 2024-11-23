-- Criar função para buscar emails dos usuários
CREATE OR REPLACE FUNCTION get_user_emails(user_ids uuid[])
RETURNS TABLE (id uuid, email text)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se o usuário atual tem permissão (é admin ou master)
  IF NOT EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR role = 'master')
  ) THEN
    RAISE EXCEPTION 'Permissão negada';
  END IF;

  -- Se for master, retorna todos os emails solicitados
  IF EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'master'
  ) THEN
    RETURN QUERY
    SELECT au.id, au.email::text
    FROM auth.users au
    WHERE au.id = ANY(user_ids);
  ELSE
    -- Se for admin, retorna apenas emails de usuários da mesma empresa
    RETURN QUERY
    SELECT au.id, au.email::text
    FROM auth.users au
    JOIN user_profiles up ON up.id = au.id
    WHERE au.id = ANY(user_ids)
    AND up.company_id = (
      SELECT company_id 
      FROM user_profiles 
      WHERE id = auth.uid()
    );
  END IF;
END;
$$;
