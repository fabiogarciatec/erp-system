-- Listar todas as funções create_user_complete com suas assinaturas
SELECT p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as args
FROM pg_proc p 
JOIN pg_namespace ns ON p.pronamespace = ns.oid 
WHERE ns.nspname = 'public' 
AND p.proname = 'create_user_complete';

-- Remover todas as versões da função
DROP FUNCTION IF EXISTS create_user_complete(uuid, character varying, character varying, character varying, character varying, character varying);
DROP FUNCTION IF EXISTS create_user_complete(uuid, character varying, character varying, character varying);
DROP FUNCTION IF EXISTS create_user_complete(uuid, text, text, text, text, text);
DROP FUNCTION IF EXISTS create_user_complete(p_user_id uuid, p_email character varying, p_company_name character varying, p_company_document character varying, p_company_email character varying, p_company_phone character varying);
DROP FUNCTION IF EXISTS create_user_complete(p_user_id uuid, p_email text, p_company_name text, p_company_document text, p_company_email text, p_company_phone text);
