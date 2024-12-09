-- Criar função para buscar a role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TABLE (role TEXT)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT r.name::TEXT
  FROM auth.users u
  JOIN user_roles ur ON ur.user_id = u.id
  JOIN roles r ON r.id = ur.role_id
  WHERE u.id = user_id
  LIMIT 1;

  -- Se nenhuma role for encontrada, retorna uma linha com NULL
  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::TEXT;
  END IF;
END;
$$;
