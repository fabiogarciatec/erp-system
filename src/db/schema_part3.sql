-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em usuarios
DROP TRIGGER IF EXISTS set_updated_at ON public.usuarios;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para atualizar updated_at em empresas
DROP TRIGGER IF EXISTS set_updated_at ON public.empresas;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.empresas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (auth_id, empresa_id, email, nome, role)
    VALUES (
        NEW.id,
        'c37d9b8c-5785-4eb8-8e5f-0d8d3a3d6e4c',
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário quando auth.users for inserido
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
