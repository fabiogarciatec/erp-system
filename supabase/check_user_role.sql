-- Verificar se o usuário existe
SELECT id, email, role
FROM auth.users
WHERE id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verificar se existe o perfil
SELECT p.*, r.name as role_name
FROM profiles p
LEFT JOIN user_roles ur ON ur.user_id = p.user_id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE p.user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verificar as roles disponíveis
SELECT * FROM roles;

-- Verificar as atribuições de roles
SELECT * FROM user_roles WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';
