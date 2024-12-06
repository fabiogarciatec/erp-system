-- Políticas para profiles
alter table profiles enable row level security;

create policy "Usuários podem ver perfis da mesma empresa"
on profiles for select
to authenticated
using (
  exists (
    select 1 from user_companies uc1
    where uc1.user_id = auth.uid()
    and exists (
      select 1 from user_companies uc2
      where uc2.company_id = uc1.company_id
      and uc2.user_id = profiles.id
    )
  )
);

create policy "Usuários podem atualizar perfis da mesma empresa"
on profiles for update
to authenticated
using (
  exists (
    select 1 from user_companies uc1
    where uc1.user_id = auth.uid()
    and exists (
      select 1 from user_companies uc2
      where uc2.company_id = uc1.company_id
      and uc2.user_id = profiles.id
    )
  )
);

-- Políticas para user_companies
alter table user_companies enable row level security;

create policy "Usuários podem ver registros da mesma empresa"
on user_companies for select
to authenticated
using (
  exists (
    select 1 from user_companies uc
    where uc.user_id = auth.uid()
    and uc.company_id = user_companies.company_id
  )
);

create policy "Usuários podem inserir registros na mesma empresa"
on user_companies for insert
to authenticated
with check (
  exists (
    select 1 from user_companies uc
    where uc.user_id = auth.uid()
    and uc.company_id = user_companies.company_id
  )
);

create policy "Usuários podem atualizar registros da mesma empresa"
on user_companies for update
to authenticated
using (
  exists (
    select 1 from user_companies uc
    where uc.user_id = auth.uid()
    and uc.company_id = user_companies.company_id
  )
);

create policy "Usuários podem deletar registros da mesma empresa"
on user_companies for delete
to authenticated
using (
  exists (
    select 1 from user_companies uc
    where uc.user_id = auth.uid()
    and uc.company_id = user_companies.company_id
  )
);

-- Políticas para user_roles
alter table user_roles enable row level security;

create policy "Usuários podem ver papéis da mesma empresa"
on user_roles for select
to authenticated
using (
  exists (
    select 1 from user_companies uc1
    where uc1.user_id = auth.uid()
    and exists (
      select 1 from user_companies uc2
      where uc2.company_id = uc1.company_id
      and uc2.user_id = user_roles.user_id
    )
  )
);

create policy "Usuários podem gerenciar papéis da mesma empresa"
on user_roles for all
to authenticated
using (
  exists (
    select 1 from user_companies uc1
    where uc1.user_id = auth.uid()
    and exists (
      select 1 from user_companies uc2
      where uc2.company_id = uc1.company_id
      and uc2.user_id = user_roles.user_id
    )
  )
);
