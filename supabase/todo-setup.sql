-- Run this whole script in the Supabase SQL Editor.
-- Replace REPLACE_WITH_YOUR_PASSPHRASE below with your real passphrase
-- before running (do this in the Supabase dashboard, not in this file --
-- this repo is public, never commit a real passphrase into it).

create extension if not exists pgcrypto;

-- The public to-do table
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

-- Everyone can read
create policy "Public read access"
  on public.todos
  for select
  using (true);

-- No insert/update/delete policies exist, so direct writes via the
-- REST API are denied for everyone. All writes must go through the
-- passphrase-checked functions below.

-- Locked-down settings table -- RLS is enabled with zero policies,
-- so nothing (including the anon key) can read or write it directly.
-- Only SECURITY DEFINER functions can reach it.
create table if not exists public.app_settings (
  key text primary key,
  value text not null
);

alter table public.app_settings enable row level security;

insert into public.app_settings (key, value)
values ('todo_passphrase_hash', crypt('REPLACE_WITH_YOUR_PASSPHRASE', gen_salt('bf')))
on conflict (key) do update set value = excluded.value;

create or replace function public.check_passphrase(input text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  stored_hash text;
begin
  select value into stored_hash from public.app_settings where key = 'todo_passphrase_hash';
  return stored_hash is not null and crypt(input, stored_hash) = stored_hash;
end;
$$;

create or replace function public.add_todo(passphrase text, todo_text text)
returns public.todos
language plpgsql
security definer
set search_path = public
as $$
declare
  new_todo public.todos;
begin
  if not public.check_passphrase(passphrase) then
    raise exception 'Invalid passphrase';
  end if;

  insert into public.todos (text, position)
  values (todo_text, (select coalesce(max(position), 0) + 1 from public.todos))
  returning * into new_todo;

  return new_todo;
end;
$$;

create or replace function public.toggle_todo(passphrase text, todo_id uuid)
returns public.todos
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_todo public.todos;
begin
  if not public.check_passphrase(passphrase) then
    raise exception 'Invalid passphrase';
  end if;

  update public.todos
  set done = not done
  where id = todo_id
  returning * into updated_todo;

  return updated_todo;
end;
$$;

create or replace function public.delete_todo(passphrase text, todo_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_passphrase(passphrase) then
    raise exception 'Invalid passphrase';
  end if;

  delete from public.todos where id = todo_id;
end;
$$;

-- Enable live updates for all visitors
alter publication supabase_realtime add table public.todos;
