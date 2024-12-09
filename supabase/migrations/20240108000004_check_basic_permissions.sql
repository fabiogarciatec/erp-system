-- Verificar e criar permissões básicas
BEGIN;

-- Lista de módulos básicos
INSERT INTO permission_modules (name, description)
VALUES 
    ('users', 'Gerenciamento de Usuários'),
    ('roles', 'Gerenciamento de Papéis'),
    ('companies', 'Gerenciamento de Empresas'),
    ('permissions', 'Gerenciamento de Permissões'),
    ('profiles', 'Gerenciamento de Perfis')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description;

-- Lista completa de permissões básicas
INSERT INTO permissions (code, name, description, module)
VALUES
    -- Módulo de Usuários
    ('USERS_VIEW', 'Visualizar Usuários', 'Permite visualizar a lista de usuários', 'users'),
    ('USERS_CREATE', 'Criar Usuários', 'Permite criar novos usuários', 'users'),
    ('USERS_EDIT', 'Editar Usuários', 'Permite editar usuários existentes', 'users'),
    ('USERS_DELETE', 'Excluir Usuários', 'Permite excluir usuários', 'users'),
    
    -- Módulo de Papéis
    ('ROLES_VIEW', 'Visualizar Papéis', 'Permite visualizar a lista de papéis', 'roles'),
    ('ROLES_CREATE', 'Criar Papéis', 'Permite criar novos papéis', 'roles'),
    ('ROLES_EDIT', 'Editar Papéis', 'Permite editar papéis existentes', 'roles'),
    ('ROLES_DELETE', 'Excluir Papéis', 'Permite excluir papéis', 'roles'),
    
    -- Módulo de Empresas
    ('COMPANIES_VIEW', 'Visualizar Empresas', 'Permite visualizar a lista de empresas', 'companies'),
    ('COMPANIES_CREATE', 'Criar Empresas', 'Permite criar novas empresas', 'companies'),
    ('COMPANIES_EDIT', 'Editar Empresas', 'Permite editar empresas existentes', 'companies'),
    ('COMPANIES_DELETE', 'Excluir Empresas', 'Permite excluir empresas', 'companies'),
    
    -- Módulo de Permissões
    ('PERMISSIONS_VIEW', 'Visualizar Permissões', 'Permite visualizar a lista de permissões', 'permissions'),
    ('PERMISSIONS_ASSIGN', 'Atribuir Permissões', 'Permite atribuir permissões a papéis', 'permissions'),
    ('PERMISSIONS_REVOKE', 'Revogar Permissões', 'Permite revogar permissões de papéis', 'permissions'),
    
    -- Módulo de Perfis
    ('PROFILES_VIEW', 'Visualizar Perfis', 'Permite visualizar perfis de usuário', 'profiles'),
    ('PROFILES_EDIT', 'Editar Perfis', 'Permite editar perfis de usuário', 'profiles'),
    ('PROFILES_ROLES', 'Gerenciar Papéis de Perfil', 'Permite atribuir/remover papéis de perfis', 'profiles')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    module = EXCLUDED.module;

-- Garantir que o Super Admin tenha todas as permissões
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Super Admin'
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);

-- Garantir que o Admin tenha permissões básicas
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Admin'
AND p.code IN (
    'USERS_VIEW',
    'USERS_EDIT',
    'ROLES_VIEW',
    'COMPANIES_VIEW',
    'COMPANIES_EDIT',
    'PROFILES_VIEW',
    'PROFILES_EDIT'
)
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);

-- Garantir que o User tenha permissões mínimas
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'User'
AND p.code IN (
    'USERS_VIEW',
    'COMPANIES_VIEW',
    'PROFILES_VIEW'
)
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
);

-- Verificar se tudo foi criado corretamente
DO $$
DECLARE
    v_modules_count INTEGER;
    v_permissions_count INTEGER;
    v_super_admin_permissions INTEGER;
    v_admin_permissions INTEGER;
    v_user_permissions INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_modules_count FROM permission_modules;
    SELECT COUNT(*) INTO v_permissions_count FROM permissions;
    
    SELECT COUNT(*) INTO v_super_admin_permissions 
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    WHERE r.name = 'Super Admin';
    
    SELECT COUNT(*) INTO v_admin_permissions 
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    WHERE r.name = 'Admin';
    
    SELECT COUNT(*) INTO v_user_permissions 
    FROM role_permissions rp
    JOIN roles r ON r.id = rp.role_id
    WHERE r.name = 'User';
    
    RAISE NOTICE 'Módulos criados: %', v_modules_count;
    RAISE NOTICE 'Permissões criadas: %', v_permissions_count;
    RAISE NOTICE 'Permissões do Super Admin: %', v_super_admin_permissions;
    RAISE NOTICE 'Permissões do Admin: %', v_admin_permissions;
    RAISE NOTICE 'Permissões do User: %', v_user_permissions;
END $$;

COMMIT;
