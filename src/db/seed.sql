-- Criar usuário admin no auth.users e na tabela usuarios

-- Remover dados existentes
TRUNCATE public.usuarios CASCADE;
TRUNCATE public.empresas CASCADE;
DELETE FROM auth.users;

-- Criar empresa padrão primeiro
INSERT INTO public.empresas (id, nome, cnpj, email)
VALUES (
    'c37d9b8c-5785-4eb8-8e5f-0d8d3a3d6e4c', -- ID fixo para referência
    'Empresa Padrão',
    '00.000.000/0000-00',
    'empresa@padrao.com'
) ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    cnpj = EXCLUDED.cnpj,
    email = EXCLUDED.email;

-- Desabilitar temporariamente o trigger de criação automática de usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar usuário admin
DO $$
DECLARE
    auth_uid UUID := 'b5852aae-8991-4600-8a3a-0cbae98e6931';
BEGIN    
    -- Inserir usuário no auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_token
    ) VALUES (
        auth_uid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'admin@empresa.com',
        crypt('123456', gen_salt('bf')), -- Senha: 123456
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{"nome":"Admin"}',
        FALSE,
        'authenticated',
        'authenticated',
        encode(gen_random_bytes(32), 'hex')
    );

    -- Inserir usuário admin diretamente na tabela usuarios
    INSERT INTO public.usuarios (auth_id, empresa_id, email, nome, role)
    VALUES (
        auth_uid,
        'c37d9b8c-5785-4eb8-8e5f-0d8d3a3d6e4c',
        'admin@empresa.com',
        'Admin',
        'admin'
    );
END $$;

-- Recriar o trigger de criação automática de usuário
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
