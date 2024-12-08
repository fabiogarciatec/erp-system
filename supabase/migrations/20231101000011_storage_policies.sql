-- Remover todas as políticas existentes
drop policy if exists "Avatars are publicly accessible" on storage.objects;
drop policy if exists "Users can upload avatars" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

-- Remover bucket existente para garantir uma configuração limpa
delete from storage.buckets where id = 'avatars';

-- Habilitar extensão de storage se não estiver habilitada
create extension if not exists "storage" schema "extensions";

-- Desabilitar RLS em todas as tabelas relevantes
alter table storage.objects disable row level security;
alter table storage.buckets disable row level security;

-- Criar bucket para avatares como público
insert into storage.buckets (id, name, public)
values ('avatars', 'avatares', true)
on conflict (id) do nothing;

-- Garantir que as permissões estejam corretas
grant all privileges on storage.objects to authenticated;
grant all privileges on storage.buckets to authenticated;
grant usage on schema storage to authenticated;
