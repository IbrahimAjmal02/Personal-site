create or replace function public.check_passphrase(input text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored_hash text;
begin
  select value into stored_hash from public.app_settings where key = 'todo_passphrase_hash';
  return stored_hash is not null and crypt(input, stored_hash) = stored_hash;
end;
$$;
