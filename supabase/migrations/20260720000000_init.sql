create type incident_severity as enum ('critical', 'high', 'medium', 'low');
create type incident_status  as enum ('investigating', 'identified', 'monitoring', 'resolved');

create table public.profiles (
  id         uuid primary key,
  name       text not null,
  email      text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.incidents (
  id          text primary key,
  title       text not null,
  description text not null default '',
  severity    incident_severity not null default 'medium',
  status      incident_status   not null default 'investigating',
  owner_id    uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index incidents_status_updated_idx on public.incidents (status, updated_at desc);

create table public.incident_updates (
  id          uuid primary key default gen_random_uuid(),
  incident_id text not null references public.incidents (id) on delete cascade,
  author_id   uuid references public.profiles (id) on delete set null,
  message     text not null check (char_length(message) between 1 and 2000),
  created_at  timestamptz not null default now()
);

create index incident_updates_incident_idx on public.incident_updates (incident_id, created_at desc);

create or replace function public.touch_incident()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'resolved' and old.status is distinct from 'resolved' then
    new.resolved_at := now();
  elsif new.status <> 'resolved' then
    new.resolved_at := null;
  end if;
  return new;
end;
$$;

create trigger incidents_touch
  before update on public.incidents
  for each row execute function public.touch_incident();

create or replace function public.touch_incident_on_update()
returns trigger language plpgsql as $$
begin
  update public.incidents set updated_at = now() where id = new.incident_id;
  return new;
end;
$$;

create trigger incident_updates_touch
  after insert on public.incident_updates
  for each row execute function public.touch_incident_on_update();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles         enable row level security;
alter table public.incidents        enable row level security;
alter table public.incident_updates enable row level security;

create policy "profiles readable by authenticated"
  on public.profiles for select
  to authenticated using (true);

create policy "profiles self-update"
  on public.profiles for update
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "incidents readable by authenticated"
  on public.incidents for select
  to authenticated using (true);

create policy "incidents writable by authenticated"
  on public.incidents for update
  to authenticated using (true) with check (true);

create policy "incident updates readable by authenticated"
  on public.incident_updates for select
  to authenticated using (true);

create policy "incident updates insertable by author"
  on public.incident_updates for insert
  to authenticated with check (auth.uid() = author_id);

alter publication supabase_realtime add table public.incidents;
alter publication supabase_realtime add table public.incident_updates;
