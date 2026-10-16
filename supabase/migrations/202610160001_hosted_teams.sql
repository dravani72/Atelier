-- RPC-only mutations keep ownership, invitation acceptance and revision checks atomic.
create schema if not exists atelier_private;
revoke all on schema atelier_private from public;
grant usage on schema atelier_private to authenticated;

create table public.atelier_teams (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(trim(name)) between 1 and 100),
 created_at timestamptz not null default now()
);
create table public.atelier_members (
 team_id uuid not null references public.atelier_teams on delete cascade,
 user_id uuid not null references auth.users on delete cascade,
 role text not null check (role in ('owner','editor','viewer')),
 primary key (team_id,user_id)
);
create unique index atelier_one_owner on public.atelier_members(team_id) where role='owner';
create table public.atelier_invites (
 id uuid primary key default gen_random_uuid(),
 team_name text not null,
 team_id uuid not null references public.atelier_teams on delete cascade,
 email text not null check (char_length(email) between 3 and 254 and email=lower(trim(email))),
 role text not null check (role in ('editor','viewer')),
 expires_at timestamptz not null default now()+interval '7 days',
 unique(team_id,email)
);
create table public.atelier_boards (
 id uuid primary key default gen_random_uuid(),
 team_id uuid not null references public.atelier_teams on delete cascade,
 name text not null check (char_length(trim(name)) between 1 and 1000),
 package jsonb not null check (coalesce(jsonb_typeof(package)='object' and package->>'format'='atelier-package' and package->>'version'='1' and jsonb_typeof(package->'boards')='array' and octet_length(package::text)<=10485760,false)),
 revision integer not null default 1 check (revision>0),
 updated_at timestamptz not null default now(),
 updated_by uuid references auth.users on delete set null
);
alter table public.atelier_teams enable row level security;
alter table public.atelier_members enable row level security;
alter table public.atelier_invites enable row level security;
alter table public.atelier_boards enable row level security;
revoke all on public.atelier_teams,public.atelier_members,public.atelier_invites,public.atelier_boards from public,anon,authenticated;
grant select on public.atelier_teams,public.atelier_members,public.atelier_invites,public.atelier_boards to authenticated;

create function atelier_private.team_role(t uuid) returns text
language sql stable security definer set search_path='' as $$
 select role from public.atelier_members where team_id=t and user_id=auth.uid()
$$;
create function atelier_private.verified_email() returns text
language sql stable security definer set search_path='' as $$
 select lower(email) from auth.users where id=auth.uid() and email_confirmed_at is not null
$$;
revoke all on function atelier_private.team_role(uuid),atelier_private.verified_email() from public;
grant execute on function atelier_private.team_role(uuid),atelier_private.verified_email() to authenticated;
create policy team_read on public.atelier_teams for select to authenticated using (atelier_private.team_role(id) is not null);
create policy member_read on public.atelier_members for select to authenticated using (atelier_private.team_role(team_id) is not null);
create policy invite_read on public.atelier_invites for select to authenticated using (atelier_private.team_role(team_id)='owner' or email=atelier_private.verified_email());
create policy board_read on public.atelier_boards for select to authenticated using (atelier_private.team_role(team_id) is not null);

create function public.atelier_create_team(team_name text) returns uuid
language plpgsql security definer set search_path='' as $$
declare t uuid;
begin
 if atelier_private.verified_email() is null then raise exception 'Sign in with a verified email first'; end if;
 if (select count(*) from public.atelier_members where user_id=auth.uid() and role='owner')>=20 then raise exception 'Team limit reached'; end if;
 insert into public.atelier_teams(name) values(trim(team_name)) returning id into t;
 insert into public.atelier_members values(t,auth.uid(),'owner');
 return t;
end $$;
create function public.atelier_invite(team uuid,invite_email text,invite_role text) returns uuid
language plpgsql security definer set search_path='' as $$
declare invitation uuid;
begin
 if atelier_private.team_role(team) is distinct from 'owner' then raise exception 'Only the team owner can invite people'; end if;
 insert into public.atelier_invites(team_id,team_name,email,role) values(team,(select name from public.atelier_teams where id=team),lower(trim(invite_email)),invite_role)
 on conflict(team_id,email) do update set id=gen_random_uuid(),role=excluded.role,expires_at=now()+interval '7 days'
 returning id into invitation;
 return invitation;
end $$;
create function public.atelier_accept_invite(invitation uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare i public.atelier_invites;
begin
 select * into i from public.atelier_invites where id=invitation for update;
 if not found or i.email is distinct from atelier_private.verified_email() or i.expires_at<=now() then raise exception 'Invitation is unavailable or expired'; end if;
 -- Accepting another invite never silently changes an existing member's role.
 insert into public.atelier_members values(i.team_id,auth.uid(),i.role) on conflict do nothing;
 delete from public.atelier_invites where id=i.id;
 return i.team_id;
end $$;
create function public.atelier_revoke_invite(invitation uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 delete from public.atelier_invites where id=invitation and atelier_private.team_role(team_id)='owner';
 if not found then raise exception 'Invitation unavailable'; end if;
end $$;
create function public.atelier_set_member(team uuid,member uuid,member_role text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if atelier_private.team_role(team) is distinct from 'owner' then raise exception 'Only the team owner can manage members'; end if;
 if member_role is not null and member_role not in ('editor','viewer') then raise exception 'Choose editor or viewer'; end if;
 if member=auth.uid() then raise exception 'The owner cannot remove or demote themselves'; end if;
 if member_role is null then delete from public.atelier_members where team_id=team and user_id=member;
 else update public.atelier_members set role=member_role where team_id=team and user_id=member; end if;
end $$;
create function public.atelier_publish(team uuid,board_name text,board_package jsonb,board_id uuid default null,expected_revision integer default null)
returns table(id uuid,revision integer)
language plpgsql security definer set search_path='' as $$
begin
 if coalesce(atelier_private.team_role(team),'') not in ('owner','editor') then raise exception 'You do not have permission to publish'; end if;
 if board_id is null then
  return query insert into public.atelier_boards(team_id,name,package,updated_by) values(team,board_name,board_package,auth.uid()) returning atelier_boards.id,atelier_boards.revision;
 else
  return query update public.atelier_boards b set name=board_name,package=board_package,revision=b.revision+1,updated_by=auth.uid(),updated_at=now()
   where b.id=board_id and b.team_id=team and b.revision=expected_revision returning b.id,b.revision;
  if not found then raise exception 'Board changed or access was removed. Refresh before publishing again.'; end if;
 end if;
end $$;
create function public.atelier_delete_board(board_id uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 delete from public.atelier_boards where id=board_id and atelier_private.team_role(team_id)='owner';
 if not found then raise exception 'Only the team owner can delete a shared board'; end if;
end $$;
-- Functions otherwise inherit PUBLIC execution privileges, including for anonymous callers.
revoke all on function public.atelier_create_team(text),public.atelier_invite(uuid,text,text),public.atelier_accept_invite(uuid),public.atelier_revoke_invite(uuid),public.atelier_set_member(uuid,uuid,text),public.atelier_publish(uuid,text,jsonb,uuid,integer),public.atelier_delete_board(uuid) from public,anon;
grant execute on function public.atelier_create_team(text),public.atelier_invite(uuid,text,text),public.atelier_accept_invite(uuid),public.atelier_revoke_invite(uuid),public.atelier_set_member(uuid,uuid,text),public.atelier_publish(uuid,text,jsonb,uuid,integer),public.atelier_delete_board(uuid) to authenticated;

create table public.atelier_profiles (
 user_id uuid primary key references auth.users on delete cascade,
 display_name text not null check (char_length(trim(display_name)) between 1 and 100)
);
alter table public.atelier_profiles enable row level security;
revoke all on public.atelier_profiles from public,anon,authenticated;
grant select,insert,update on public.atelier_profiles to authenticated;
create function atelier_private.shares_team(other_user uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.atelier_members a join public.atelier_members b using(team_id) where a.user_id=auth.uid() and b.user_id=other_user)
$$;
revoke all on function atelier_private.shares_team(uuid) from public;
grant execute on function atelier_private.shares_team(uuid) to authenticated;
create policy profile_read on public.atelier_profiles for select to authenticated using(user_id=auth.uid() or atelier_private.shares_team(user_id));
create policy profile_insert on public.atelier_profiles for insert to authenticated with check(user_id=auth.uid());
create policy profile_update on public.atelier_profiles for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
