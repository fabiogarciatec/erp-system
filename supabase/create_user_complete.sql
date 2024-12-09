-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop the function if it exists
drop function if exists public.create_user_complete;

-- Create the function
create or replace function public.create_user_complete(
  p_user_id uuid,
  p_email text,
  p_company_name text,
  p_company_document text,
  p_company_email text,
  p_company_phone text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_company_id uuid;
  v_default_role_id uuid;
  v_result json;
  v_debug_info json;
  v_step text;
begin
  -- Inicializar step
  v_step := 'init';

  -- Verificar parâmetros de entrada
  if p_user_id is null or p_email is null or p_company_name is null then
    return json_build_object(
      'success', false,
      'error', 'Missing required parameters',
      'error_detail', 'INVALID_PARAMS',
      'debug_info', json_build_object('step', v_step, 'params', json_build_object(
        'user_id', p_user_id,
        'email', p_email,
        'company_name', p_company_name
      ))
    );
  end if;

  -- Verificar perfil existente
  v_step := 'check_profile';
  if exists (
    select 1 
    from public.profiles 
    where user_id = p_user_id 
       or email = p_email
  ) then
    return json_build_object(
      'success', false,
      'error', 'Profile already exists',
      'error_detail', 'PROFILE_EXISTS',
      'debug_info', json_build_object(
        'step', v_step,
        'existing_profile', (
          select row_to_json(p) 
          from public.profiles p 
          where p.user_id = p_user_id or p.email = p_email
        )
      )
    );
  end if;

  -- Criar empresa
  v_step := 'create_company';
  begin
    insert into public.companies (
      id,
      name,
      document,
      email,
      phone,
      created_at,
      updated_at
    ) values (
      uuid_generate_v4(),
      p_company_name,
      p_company_document,
      p_company_email,
      p_company_phone,
      now(),
      now()
    ) returning id into v_company_id;

    raise notice 'Company created with ID: %', v_company_id;
  exception when others then
    return json_build_object(
      'success', false,
      'error', format('Error creating company: %s', SQLERRM),
      'error_detail', 'COMPANY_CREATE_ERROR',
      'debug_info', json_build_object(
        'step', v_step,
        'sqlstate', SQLSTATE,
        'error_detail', SQLERRM
      )
    );
  end;

  -- Criar perfil
  v_step := 'create_profile';
  begin
    insert into public.profiles (
      user_id,
      email,
      created_at,
      updated_at
    ) values (
      p_user_id,
      p_email,
      now(),
      now()
    );

    raise notice 'Profile created for user ID: %', p_user_id;
  exception when others then
    -- Limpar empresa criada
    delete from public.companies where id = v_company_id;
    
    return json_build_object(
      'success', false,
      'error', format('Error creating profile: %s', SQLERRM),
      'error_detail', 'PROFILE_CREATE_ERROR',
      'debug_info', json_build_object(
        'step', v_step,
        'sqlstate', SQLSTATE,
        'error_detail', SQLERRM
      )
    );
  end;

  -- Criar relação usuário-empresa
  v_step := 'create_user_company';
  begin
    insert into public.user_companies (
      user_id,
      company_id,
      created_at
    ) values (
      p_user_id,
      v_company_id,
      now()
    );

    raise notice 'User-company relationship created for user ID: % and company ID: %', p_user_id, v_company_id;
  exception when others then
    -- Limpar registros anteriores
    delete from public.user_companies where user_id = p_user_id;
    delete from public.profiles where user_id = p_user_id;
    delete from public.companies where id = v_company_id;
    
    return json_build_object(
      'success', false,
      'error', format('Error creating user-company relationship: %s', SQLERRM),
      'error_detail', 'USER_COMPANY_CREATE_ERROR',
      'debug_info', json_build_object(
        'step', v_step,
        'sqlstate', SQLSTATE,
        'error_detail', SQLERRM
      )
    );
  end;

  -- Obter papel padrão
  v_step := 'get_default_role';
  select id into v_default_role_id
  from public.roles
  where name = 'Super Admin'
  limit 1;

  if v_default_role_id is null then
    -- Limpar registros anteriores
    delete from public.user_companies where user_id = p_user_id;
    delete from public.profiles where user_id = p_user_id;
    delete from public.companies where id = v_company_id;
    
    return json_build_object(
      'success', false,
      'error', 'Default role not found',
      'error_detail', 'ROLE_NOT_FOUND',
      'debug_info', json_build_object(
        'step', v_step,
        'roles_count', (select count(*) from public.roles)
      )
    );
  end if;

  -- Criar relação usuário-papel
  v_step := 'create_user_role';
  begin
    insert into public.user_roles (
      user_id,
      role_id,
      created_at
    ) values (
      p_user_id,
      v_default_role_id,
      now()
    );

    raise notice 'User-role relationship created for user ID: % and role ID: %', p_user_id, v_default_role_id;
  exception when others then
    -- Limpar registros anteriores
    delete from public.user_companies where user_id = p_user_id;
    delete from public.profiles where user_id = p_user_id;
    delete from public.companies where id = v_company_id;
    
    return json_build_object(
      'success', false,
      'error', format('Error creating user-role relationship: %s', SQLERRM),
      'error_detail', 'USER_ROLE_CREATE_ERROR',
      'debug_info', json_build_object(
        'step', v_step,
        'sqlstate', SQLSTATE,
        'error_detail', SQLERRM,
        'role_id', v_default_role_id
      )
    );
  end;

  -- Sucesso
  return json_build_object(
    'success', true,
    'company_id', v_company_id,
    'user_id', p_user_id,
    'debug_info', json_build_object(
      'final_step', v_step,
      'company_id', v_company_id,
      'user_id', p_user_id,
      'role_id', v_default_role_id
    )
  );

exception when others then
  -- Em caso de erro não tratado
  -- Tentar limpar registros criados
  if v_company_id is not null then
    delete from public.user_companies where company_id = v_company_id;
    delete from public.profiles where user_id = p_user_id;
    delete from public.companies where id = v_company_id;
  end if;
  
  return json_build_object(
    'success', false,
    'error', SQLERRM,
    'error_detail', 'UNHANDLED_ERROR',
    'debug_info', json_build_object(
      'step', v_step,
      'sqlstate', SQLSTATE,
      'error_detail', SQLERRM
    )
  );
end;
$$;
