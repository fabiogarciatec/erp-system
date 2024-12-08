-- Verificar registros na tabela profiles
select p.*, c.name as company_name
from public.profiles p
left join public.companies c on p.company_id = c.id
order by p.created_at desc
limit 5;
