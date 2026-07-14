-- HomiePG Complete Supabase SQL
-- Copy and execute this in the Supabase SQL editor.

create extension if not exists "uuid-ossp";

create type public.app_role as enum ('super_admin','owner','tenant');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  role public.app_role not null default 'tenant',
  gender text,
  date_of_birth date,
  address text,
  emergency_contact text,
  profile_photo_url text,
  business_name text,
  gst text,
  pan text,
  verification_status text default 'pending',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.owners (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_name text,
  gst text,
  pan text,
  building_count int default 0,
  verification_status text default 'pending',
  subscription_status text default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.tenants (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  current_booking_id uuid,
  current_bed_id uuid,
  kyc_status text default 'pending',
  move_in_date date,
  expected_move_out_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.buildings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.owners(id) on delete cascade,
  name text not null,
  city text,
  area text,
  address text,
  total_floors int default 1,
  gender_type text default 'unisex',
  food_type text default 'both',
  parking_available boolean default false,
  wifi_available boolean default false,
  laundry_available boolean default false,
  image_url text,
  description text,
  status text default 'active' check (status in ('active','inactive','maintenance')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.floors (
  id uuid primary key default uuid_generate_v4(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  floor_number int not null check (floor_number > 0),
  name text,
  status text default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.rooms (
  id uuid primary key default uuid_generate_v4(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  floor_id uuid references public.floors(id) on delete set null,
  room_number text not null,
  capacity int default 1 check (capacity > 0),
  status text default 'available' check (status in ('available','occupied','maintenance')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.beds (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  bed_number text not null,
  status text default 'available' check (status in ('available','occupied','reserved','maintenance')),
  monthly_rent numeric(10,2) default 0 check (monthly_rent >= 0),
  deposit numeric(10,2) default 0 check (deposit >= 0),
  tenant_id uuid references public.tenants(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.amenities (
  id uuid primary key default uuid_generate_v4(),
  building_id uuid references public.buildings(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bed_id uuid not null references public.beds(id) on delete cascade,
  booking_date date default current_date,
  status text default 'pending' check (status in ('pending','approved','rejected','completed')),
  amount numeric(10,2) default 0,
  deposit numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.saved_pgs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  building_id uuid not null references public.buildings(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  amount numeric(10,2) default 0,
  payment_date date default current_date,
  status text default 'pending' check (status in ('pending','paid','failed')),
  receipt_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.owners(id) on delete cascade,
  building_id uuid references public.buildings(id) on delete set null,
  title text not null,
  amount numeric(10,2) default 0,
  expense_date date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.employees (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.owners(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  role text not null,
  status text default 'active' check (status in ('active','inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  message text not null,
  priority text default 'medium' check (priority in ('low','medium','high','urgent')),
  status text default 'open' check (status in ('open','pending','resolved','closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.subscription_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric(10,2) default 0,
  features jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.owner_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.owners(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  start_date date default current_date,
  end_date date,
  status text default 'active' check (status in ('active','expired','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.platform_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text not null unique,
  setting_value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  details jsonb,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles(id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'tenant')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists trg_owners_updated_at on public.owners;
create trigger trg_owners_updated_at before update on public.owners for each row execute function public.set_updated_at();

drop trigger if exists trg_tenants_updated_at on public.tenants;
create trigger trg_tenants_updated_at before update on public.tenants for each row execute function public.set_updated_at();

drop trigger if exists trg_buildings_updated_at on public.buildings;
create trigger trg_buildings_updated_at before update on public.buildings for each row execute function public.set_updated_at();

drop trigger if exists trg_floors_updated_at on public.floors;
create trigger trg_floors_updated_at before update on public.floors for each row execute function public.set_updated_at();

drop trigger if exists trg_rooms_updated_at on public.rooms;
create trigger trg_rooms_updated_at before update on public.rooms for each row execute function public.set_updated_at();

drop trigger if exists trg_beds_updated_at on public.beds;
create trigger trg_beds_updated_at before update on public.beds for each row execute function public.set_updated_at();

drop trigger if exists trg_amenities_updated_at on public.amenities;
create trigger trg_amenities_updated_at before update on public.amenities for each row execute function public.set_updated_at();

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at before update on public.bookings for each row execute function public.set_updated_at();

drop trigger if exists trg_saved_pgs_updated_at on public.saved_pgs;
create trigger trg_saved_pgs_updated_at before update on public.saved_pgs for each row execute function public.set_updated_at();

drop trigger if exists trg_reviews_updated_at on public.reviews;
create trigger trg_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

drop trigger if exists trg_notifications_updated_at on public.notifications;
create trigger trg_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

drop trigger if exists trg_expenses_updated_at on public.expenses;
create trigger trg_expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();

drop trigger if exists trg_employees_updated_at on public.employees;
create trigger trg_employees_updated_at before update on public.employees for each row execute function public.set_updated_at();

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();

drop trigger if exists trg_subscription_plans_updated_at on public.subscription_plans;
create trigger trg_subscription_plans_updated_at before update on public.subscription_plans for each row execute function public.set_updated_at();

drop trigger if exists trg_owner_subscriptions_updated_at on public.owner_subscriptions;
create trigger trg_owner_subscriptions_updated_at before update on public.owner_subscriptions for each row execute function public.set_updated_at();

drop trigger if exists trg_contact_messages_updated_at on public.contact_messages;
create trigger trg_contact_messages_updated_at before update on public.contact_messages for each row execute function public.set_updated_at();

drop trigger if exists trg_platform_settings_updated_at on public.platform_settings;
create trigger trg_platform_settings_updated_at before update on public.platform_settings for each row execute function public.set_updated_at();

drop trigger if exists trg_activity_logs_updated_at on public.activity_logs;
create trigger trg_activity_logs_updated_at before update on public.activity_logs for each row execute function public.set_updated_at();

drop trigger if exists trg_audit_logs_updated_at on public.audit_logs;
create trigger trg_audit_logs_updated_at before update on public.audit_logs for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.subscription_plans(name, price, features) values
('Free', 0, '{"max_buildings": 1, "support": "email"}'::jsonb),
('Starter', 499, '{"max_buildings": 5, "support": "priority"}'::jsonb),
('Pro', 1499, '{"max_buildings": 20, "support": "priority"}'::jsonb),
('Enterprise', 4999, '{"max_buildings": 100, "support": "dedicated"}'::jsonb)
on conflict do nothing;

insert into public.platform_settings(setting_key, setting_value) values
('maintenance_mode', '{"enabled": false}'::jsonb),
('default_currency', '{"currency": "INR"}'::jsonb)
on conflict (setting_key) do nothing;

alter table public.profiles enable row level security;
alter table public.owners enable row level security;
alter table public.tenants enable row level security;
alter table public.buildings enable row level security;
alter table public.floors enable row level security;
alter table public.rooms enable row level security;
alter table public.beds enable row level security;
alter table public.amenities enable row level security;
alter table public.bookings enable row level security;
alter table public.saved_pgs enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.employees enable row level security;
alter table public.support_tickets enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.owner_subscriptions enable row level security;
alter table public.contact_messages enable row level security;
alter table public.platform_settings enable row level security;
alter table public.activity_logs enable row level security;
alter table public.audit_logs enable row level security;

create policy if not exists "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy if not exists "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy if not exists "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "buildings_read_public" on public.buildings for select using (true);
create policy if not exists "bookings_read_own" on public.bookings for select using (auth.uid() = tenant_id::uuid or auth.uid() = (select profile_id from public.tenants where id = tenant_id));
create policy if not exists "notifications_read_own" on public.notifications for select using (auth.uid() = profile_id);
create policy if not exists "contact_messages_insert_public" on public.contact_messages for insert with check (true);

create policy if not exists "subscription_plans_read_public" on public.subscription_plans for select using (true);
