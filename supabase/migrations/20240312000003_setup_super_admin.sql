-- Criar o papel Super Admin se não existir
INSERT INTO roles (name, description)
VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
ON CONFLICT (name) DO NOTHING;

-- Atualizar o primeiro usuário para ser Super Admin
WITH first_user AS (
    SELECT auth.users.id
    FROM auth.users
    ORDER BY created_at
    LIMIT 1
),
super_admin_role AS (
    SELECT id FROM roles WHERE name = 'Super Admin'
)
UPDATE profiles
SET role_id = super_admin_role.id
FROM first_user, super_admin_role
WHERE profiles.user_id = first_user.id;

-- Garantir que o Super Admin tenha todas as permissões
WITH super_admin_role AS (
    SELECT id FROM roles WHERE name = 'Super Admin'
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT super_admin_role.id, permissions.id
FROM super_admin_role, permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;
