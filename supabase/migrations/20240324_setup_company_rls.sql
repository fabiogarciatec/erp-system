-- Função auxiliar para verificar se o usuário tem acesso à empresa
CREATE OR REPLACE FUNCTION public.fn_user_has_company_access(company_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() 
    AND (
      role = 'master' 
      OR (
        role IN ('admin', 'manager', 'user') 
        AND company_id = fn_user_has_company_access.company_id
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter o company_id do usuário atual
CREATE OR REPLACE FUNCTION public.fn_get_user_company_id()
RETURNS uuid AS $$
DECLARE
  user_company_id uuid;
BEGIN
  SELECT company_id INTO user_company_id
  FROM public.user_profiles
  WHERE id = auth.uid();
  RETURN user_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Isolate companies by user access" ON public.companies;
DROP POLICY IF EXISTS "Isolate customers by company" ON public.customers;
DROP POLICY IF EXISTS "Isolate user profiles by company" ON public.user_profiles;

-- Política para companies
CREATE POLICY "Isolate companies by user access"
ON public.companies
FOR ALL
TO authenticated
USING (
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'master'
    ) THEN true
    ELSE id IN (
      SELECT company_id 
      FROM public.user_profiles 
      WHERE id = auth.uid()
    )
  END
)
WITH CHECK (
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'master'
    ) THEN true
    ELSE id IN (
      SELECT company_id 
      FROM public.user_profiles 
      WHERE id = auth.uid()
    )
  END
);

-- Política para customers
CREATE POLICY "Isolate customers by company"
ON public.customers
FOR ALL
TO authenticated
USING (
  fn_user_has_company_access(company_id)
)
WITH CHECK (
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'master'
    ) THEN true
    ELSE company_id = fn_get_user_company_id()
  END
);

-- Política para user_profiles
CREATE POLICY "Isolate user profiles by company"
ON public.user_profiles
FOR ALL
TO authenticated
USING (
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'master'
    ) THEN true
    ELSE company_id = (
      SELECT up.company_id 
      FROM public.user_profiles up 
      WHERE up.id = auth.uid()
    )
  END
)
WITH CHECK (
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'master'
    ) THEN true
    ELSE company_id = (
      SELECT up.company_id 
      FROM public.user_profiles up 
      WHERE up.id = auth.uid()
    )
  END
);

-- Trigger para garantir que novos registros sejam associados à empresa do usuário
CREATE OR REPLACE FUNCTION public.fn_set_company_id()
RETURNS trigger AS $$
DECLARE
  user_company_id uuid;
  is_master boolean;
BEGIN
  -- Verificar se é usuário master
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'master'
  ) INTO is_master;

  -- Se não for master, força o company_id do usuário
  IF NOT is_master THEN
    SELECT company_id INTO user_company_id
    FROM public.user_profiles
    WHERE id = auth.uid();

    NEW.company_id = user_company_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger em customers
DROP TRIGGER IF EXISTS tr_set_company_id ON public.customers;
CREATE TRIGGER tr_set_company_id
  BEFORE INSERT OR UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_set_company_id();

-- Aplicar trigger em user_profiles (exceto para master)
DROP TRIGGER IF EXISTS tr_set_company_id ON public.user_profiles;
CREATE TRIGGER tr_set_company_id
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW
  WHEN (NEW.role != 'master')
  EXECUTE FUNCTION public.fn_set_company_id();
