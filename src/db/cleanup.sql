-- Desabilitar RLS em todas as tabelas
ALTER TABLE IF EXISTS public.empresas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes de empresas
DROP POLICY IF EXISTS "empresas_insert_anon" ON public.empresas;
DROP POLICY IF EXISTS "empresas_select_auth" ON public.empresas;
DROP POLICY IF EXISTS "policy_empresas" ON public.empresas;
DROP POLICY IF EXISTS "temp_empresas_policy" ON public.empresas;

-- Remover todas as políticas existentes de usuários
DROP POLICY IF EXISTS "usuarios_insert" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_select" ON public.usuarios;
DROP POLICY IF EXISTS "policy_usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "temp_usuarios_policy" ON public.usuarios;

-- Remover todas as políticas existentes de customers
DROP POLICY IF EXISTS "customers_all" ON public.customers;
DROP POLICY IF EXISTS "policy_customers" ON public.customers;
DROP POLICY IF EXISTS "temp_customers_policy" ON public.customers;

-- Garantir que todas as políticas sejam removidas (força bruta)
DO $$ 
DECLARE 
    _tbl text;
    _pol text;
BEGIN
    FOR _tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        FOR _pol IN (
            SELECT polname 
            FROM pg_policy 
            WHERE schemaname = 'public' 
            AND tablename = _tbl
        )
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', _pol, _tbl);
        END LOOP;
        
        -- Desabilitar RLS na tabela
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', _tbl);
    END LOOP;
END $$;
