-- Habilitar RLS nas tabelas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
DROP POLICY IF EXISTS "Empresas são visíveis para usuários autenticados" ON public.empresas;
CREATE POLICY "Empresas são visíveis para usuários autenticados"
    ON public.empresas
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Usuários admin podem editar empresas" ON public.empresas;
CREATE POLICY "Usuários admin podem editar empresas"
    ON public.empresas
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Políticas para usuários
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.usuarios;
CREATE POLICY "Usuários podem ver seus próprios dados"
    ON public.usuarios
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Usuários podem editar seus próprios dados" ON public.usuarios;
CREATE POLICY "Usuários podem editar seus próprios dados"
    ON public.usuarios
    FOR UPDATE
    TO authenticated
    USING (
        auth_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins podem gerenciar todos os usuários" ON public.usuarios;
CREATE POLICY "Admins podem gerenciar todos os usuários"
    ON public.usuarios
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios
            WHERE auth_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Garantir que as tabelas são acessíveis após a criação
GRANT ALL ON public.empresas TO authenticated;
GRANT ALL ON public.usuarios TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
