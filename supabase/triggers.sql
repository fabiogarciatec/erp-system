-- Trigger para criar perfil automaticamente após o registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Chama a função create_user_complete para criar o usuário completo
    PERFORM create_user_complete(
        NEW.id,
        NEW.email,
        'Minha Empresa', -- Nome padrão da empresa
        '00000000000000'  -- CNPJ padrão (será atualizado depois)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop do trigger se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
