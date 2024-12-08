-- Remover função existente
DROP FUNCTION IF EXISTS exec_sql(text);

-- Criar função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
RETURNS void AS $$
BEGIN
  EXECUTE sql_string;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para buscar dados do usuário
CREATE OR REPLACE FUNCTION get_user_data(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  avatar_url TEXT,
  company_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.avatar_url,
    p.company_id,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql;
