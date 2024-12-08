-- Verificar permissões das tabelas
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'companies', 'user_companies', 'user_roles', 'roles')
ORDER BY table_name, grantee;

-- Verificar constraints das tabelas
SELECT tc.table_name, tc.constraint_name, tc.constraint_type, 
       kcu.column_name, rc.update_rule, rc.delete_rule
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
  AND tc.table_schema = rc.constraint_schema
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('profiles', 'companies', 'user_companies', 'user_roles', 'roles')
ORDER BY tc.table_name, tc.constraint_type;
