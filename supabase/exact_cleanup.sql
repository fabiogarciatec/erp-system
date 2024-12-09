-- Remover todas as versões existentes da função
DROP FUNCTION IF EXISTS create_user_complete(p_user_id uuid, p_email text, p_company_name text, p_company_document text, p_company_email text, p_company_phone text);
DROP FUNCTION IF EXISTS create_user_complete(p_user_id uuid, p_email character varying, p_company_name character varying, p_company_document character varying, p_company_email character varying, p_company_phone character varying);
DROP FUNCTION IF EXISTS create_user_complete(p_user_id uuid, p_email text, p_company_name text, p_company_document text, p_company_email text, p_company_phone text, p_role_name text);
DROP FUNCTION IF EXISTS create_user_complete(p_user_id uuid, p_email character varying, p_company_name character varying, p_company_document character varying, p_company_email character varying, p_company_phone character varying, p_role_name character varying);

-- Remover todas as tabelas
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS permission_modules CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Criar tabelas básicas
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(14) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users ON DELETE CASCADE,
    email VARCHAR(255),
    role_id UUID REFERENCES roles(id),
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Desabilitar RLS
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Criar a função exatamente como o frontend espera
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id uuid,
    p_email character varying,
    p_company_name character varying,
    p_company_document character varying,
    p_company_email character varying DEFAULT NULL,
    p_company_phone character varying DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id UUID;
    v_role_id UUID;
BEGIN
    -- Criar empresa
    INSERT INTO companies (name, document, email, phone)
    VALUES (p_company_name, p_company_document, p_company_email, p_company_phone)
    RETURNING id INTO v_company_id;

    -- Criar ou obter papel Super Admin
    INSERT INTO roles (name, description)
    VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
    ON CONFLICT (name) DO UPDATE SET name = 'Super Admin'
    RETURNING id INTO v_role_id;

    -- Criar perfil
    INSERT INTO profiles (user_id, email, role_id, company_id)
    VALUES (p_user_id, p_email, v_role_id, v_company_id);

    RETURN jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'user_id', p_user_id,
            'company_id', v_company_id,
            'role_id', v_role_id
        )
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;
