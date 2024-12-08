-- Primeiro, deletar todas as associações do usuário
delete from public.user_companies where user_id = '46fd3e58-6d4c-4c02-8bb6-53cbf35055c6';
delete from public.user_roles where user_id = '46fd3e58-6d4c-4c02-8bb6-53cbf35055c6';

-- Depois, deletar o usuário da tabela auth.users
delete from auth.users where id = '46fd3e58-6d4c-4c02-8bb6-53cbf35055c6';

-- Se houver alguma empresa órfã (sem usuários associados), você pode deletá-la também
delete from public.companies 
where id not in (select company_id from public.user_companies);
