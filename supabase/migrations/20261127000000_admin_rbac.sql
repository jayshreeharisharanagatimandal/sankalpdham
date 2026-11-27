create table if not exists public.admin_roles (
  code text primary key,
  name text not null,
  description text not null default ''
);

create table if not exists public.admin_permissions (
  code text primary key,
  description text not null default ''
);

create table if not exists public.admin_role_permissions (
  role_code text not null references public.admin_roles(code) on delete cascade,
  permission_code text not null references public.admin_permissions(code) on delete cascade,
  primary key (role_code, permission_code)
);

create table if not exists public.admin_user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_code text not null references public.admin_roles(code) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_code)
);

alter table public.admin_roles enable row level security;
alter table public.admin_permissions enable row level security;
alter table public.admin_role_permissions enable row level security;
alter table public.admin_user_roles enable row level security;

drop policy if exists "Authenticated users can read admin roles" on public.admin_roles;
create policy "Authenticated users can read admin roles"
  on public.admin_roles for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can read admin permissions" on public.admin_permissions;
create policy "Authenticated users can read admin permissions"
  on public.admin_permissions for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can read admin role permissions" on public.admin_role_permissions;
create policy "Authenticated users can read admin role permissions"
  on public.admin_role_permissions for select
  to authenticated
  using (true);

drop policy if exists "Users can read their own admin roles" on public.admin_user_roles;
create policy "Users can read their own admin roles"
  on public.admin_user_roles for select
  to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.admin_roles to authenticated;
grant select on public.admin_permissions to authenticated;
grant select on public.admin_role_permissions to authenticated;
grant select on public.admin_user_roles to authenticated;
grant all on public.admin_user_roles to service_role;

insert into public.admin_roles (code, name, description)
values
  ('super_admin', 'Super Admin', 'Full access to all admin capabilities.'),
  ('admin', 'Admin', 'Dashboard access and user directory access.')
on conflict (code) do update
set name = excluded.name, description = excluded.description;

insert into public.admin_permissions (code, description)
values
  ('dashboard.view', 'View the admin dashboard.'),
  ('users.read', 'View the user directory.'),
  ('users.manage', 'Create, update, and deactivate users.'),
  ('roles.manage', 'Manage admin roles and permissions.'),
  ('audit.read', 'View administrative activity logs.'),
  ('settings.manage', 'Manage admin settings.')
on conflict (code) do update
set description = excluded.description;

insert into public.admin_role_permissions (role_code, permission_code)
select 'super_admin', code
from public.admin_permissions
on conflict do nothing;

insert into public.admin_role_permissions (role_code, permission_code)
values
  ('admin', 'dashboard.view'),
  ('admin', 'users.read')
on conflict do nothing;
