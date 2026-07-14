-- ============================================================================
-- HomiePG Complete Supabase SQL — Production-Ready
-- Copy and execute this in the Supabase SQL editor.
--
-- This file is safe to re-run (idempotent): tables use `create table if not
-- exists`, triggers/policies are dropped and recreated, and views use
-- `create or replace view`.
--
-- Sections:
--   1. Extensions & Types
--   2. Tables (unchanged names/columns from the original schema)
--   3. Indexes
--   4. Business-rule constraints
--   5. Helper functions (used by RLS policies & triggers)
--   6. Triggers (updated_at, new-user provisioning, business-rule automation)
--   7. Seed data
--   8. Row Level Security + Policies
--   9. Dashboard views (for the Owner module)
--  10. Grants
-- ============================================================================


-- ============================================================================
-- 1. EXTENSIONS & TYPES
-- ============================================================================

create extension if not exists "uuid-ossp";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('super_admin','owner','tenant');
  end if;
end $$;


-- ============================================================================
-- 2. TABLES (unchanged from original schema)
-- ============================================================================

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
  amount numeric(10,2) default 0 check (amount >= 0),
  deposit numeric(10,2) default 0 check (deposit >= 0),
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
  amount numeric(10,2) default 0 check (amount >= 0),
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
  amount numeric(10,2) default 0 check (amount >= 0),
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
  price numeric(10,2) default 0 check (price >= 0),
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

-- current_booking_id / current_bed_id on tenants reference tables created
-- later in the file, so these FKs are added here rather than inline above.
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'tenants_current_booking_id_fkey'
  ) then
    alter table public.tenants
      add constraint tenants_current_booking_id_fkey
      foreign key (current_booking_id) references public.bookings(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'tenants_current_bed_id_fkey'
  ) then
    alter table public.tenants
      add constraint tenants_current_bed_id_fkey
      foreign key (current_bed_id) references public.beds(id) on delete set null;
  end if;
end $$;


-- ============================================================================
-- 3. INDEXES
-- ============================================================================
-- Every foreign key gets an index, plus indexes on columns used heavily in
-- WHERE/ORDER BY clauses by the Owner module (status, dates, lookups).
-- Partial indexes (`where deleted_at is null`) speed up the common case of
-- listing only "live" rows, which is nearly every query in the app.

create index if not exists idx_profiles_role on public.profiles(role) where deleted_at is null;

create index if not exists idx_owners_profile_id on public.owners(profile_id);
create unique index if not exists uq_owners_profile_id on public.owners(profile_id) where deleted_at is null;

create index if not exists idx_tenants_profile_id on public.tenants(profile_id);
create unique index if not exists uq_tenants_profile_id on public.tenants(profile_id) where deleted_at is null;
create index if not exists idx_tenants_current_bed_id on public.tenants(current_bed_id);
create index if not exists idx_tenants_current_booking_id on public.tenants(current_booking_id);

create index if not exists idx_buildings_owner_id on public.buildings(owner_id);
create index if not exists idx_buildings_city on public.buildings(city) where deleted_at is null;
create index if not exists idx_buildings_status on public.buildings(status) where deleted_at is null;

create index if not exists idx_floors_building_id on public.floors(building_id);

create index if not exists idx_rooms_building_id on public.rooms(building_id);
create index if not exists idx_rooms_floor_id on public.rooms(floor_id);
create index if not exists idx_rooms_status on public.rooms(status) where deleted_at is null;

create index if not exists idx_beds_room_id on public.beds(room_id);
create index if not exists idx_beds_tenant_id on public.beds(tenant_id);
create index if not exists idx_beds_status on public.beds(status) where deleted_at is null;

create index if not exists idx_amenities_building_id on public.amenities(building_id);

create index if not exists idx_bookings_tenant_id on public.bookings(tenant_id);
create index if not exists idx_bookings_bed_id on public.bookings(bed_id);
create index if not exists idx_bookings_status on public.bookings(status) where deleted_at is null;

create index if not exists idx_saved_pgs_tenant_id on public.saved_pgs(tenant_id);
create index if not exists idx_saved_pgs_building_id on public.saved_pgs(building_id);

create index if not exists idx_reviews_tenant_id on public.reviews(tenant_id);
create index if not exists idx_reviews_building_id on public.reviews(building_id);

create index if not exists idx_notifications_profile_id on public.notifications(profile_id);
create index if not exists idx_notifications_unread on public.notifications(profile_id) where is_read = false and deleted_at is null;

create index if not exists idx_payments_tenant_id on public.payments(tenant_id);
create index if not exists idx_payments_booking_id on public.payments(booking_id);
create index if not exists idx_payments_status on public.payments(status) where deleted_at is null;
create index if not exists idx_payments_payment_date on public.payments(payment_date);

create index if not exists idx_expenses_owner_id on public.expenses(owner_id);
create index if not exists idx_expenses_building_id on public.expenses(building_id);
create index if not exists idx_expenses_expense_date on public.expenses(expense_date);

create index if not exists idx_employees_owner_id on public.employees(owner_id);
create index if not exists idx_employees_profile_id on public.employees(profile_id);

create index if not exists idx_support_tickets_profile_id on public.support_tickets(profile_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status) where deleted_at is null;

create index if not exists idx_owner_subscriptions_owner_id on public.owner_subscriptions(owner_id);
create index if not exists idx_owner_subscriptions_plan_id on public.owner_subscriptions(plan_id);
create index if not exists idx_owner_subscriptions_status on public.owner_subscriptions(status);

create index if not exists idx_activity_logs_profile_id on public.activity_logs(profile_id);
create index if not exists idx_audit_logs_profile_id on public.audit_logs(profile_id);


-- ============================================================================
-- 4. BUSINESS-RULE CONSTRAINTS
-- ============================================================================
-- Uniqueness and cross-field rules that keep the data internally consistent.
-- Wrapped in DO blocks with existence checks so this file can be re-run
-- safely (Postgres has no `ADD CONSTRAINT IF NOT EXISTS`).

do $$
begin
  -- A room number must be unique within a building.
  if not exists (select 1 from pg_constraint where conname = 'uq_rooms_building_room_number') then
    alter table public.rooms
      add constraint uq_rooms_building_room_number unique (building_id, room_number);
  end if;

  -- A bed number must be unique within a room.
  if not exists (select 1 from pg_constraint where conname = 'uq_beds_room_bed_number') then
    alter table public.beds
      add constraint uq_beds_room_bed_number unique (room_id, bed_number);
  end if;

  -- A floor number must be unique within a building.
  if not exists (select 1 from pg_constraint where conname = 'uq_floors_building_floor_number') then
    alter table public.floors
      add constraint uq_floors_building_floor_number unique (building_id, floor_number);
  end if;

  -- A tenant can only save a given building once.
  if not exists (select 1 from pg_constraint where conname = 'uq_saved_pgs_tenant_building') then
    alter table public.saved_pgs
      add constraint uq_saved_pgs_tenant_building unique (tenant_id, building_id);
  end if;

  -- One review per tenant per building.
  if not exists (select 1 from pg_constraint where conname = 'uq_reviews_tenant_building') then
    alter table public.reviews
      add constraint uq_reviews_tenant_building unique (tenant_id, building_id);
  end if;

  -- Expected move-out must be after move-in, when both are set.
  if not exists (select 1 from pg_constraint where conname = 'chk_tenants_move_dates') then
    alter table public.tenants
      add constraint chk_tenants_move_dates
      check (expected_move_out_date is null or move_in_date is null or expected_move_out_date > move_in_date);
  end if;

  -- Subscription end date must be after its start date, when set.
  if not exists (select 1 from pg_constraint where conname = 'chk_owner_subscriptions_dates') then
    alter table public.owner_subscriptions
      add constraint chk_owner_subscriptions_dates
      check (end_date is null or end_date > start_date);
  end if;

  -- A floor's number can't exceed the building's declared total_floors.
  -- (Enforced via trigger below, since it needs a cross-table lookup.)
end $$;

-- Only one bed can be actively "approved" for booking at a time — prevents
-- double-booking the same bed.
create unique index if not exists uq_bookings_one_approved_per_bed
  on public.bookings(bed_id)
  where status = 'approved' and deleted_at is null;

-- A building can have at most one active (non-cancelled/expired) subscription.
create unique index if not exists uq_owner_subscriptions_one_active_per_owner
  on public.owner_subscriptions(owner_id)
  where status = 'active';


-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================
-- SECURITY DEFINER + a locked-down search_path so these can be used safely
-- inside RLS policies without triggering recursive RLS checks on the tables
-- they query, and without being hijackable via search_path tricks.

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

create or replace function public.current_owner_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.owners where profile_id = auth.uid() and deleted_at is null;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.tenants where profile_id = auth.uid() and deleted_at is null;
$$;

-- True if the currently-authenticated owner owns the given building.
create or replace function public.owns_building(p_building_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.buildings b
    join public.owners o on o.id = b.owner_id
    where b.id = p_building_id and o.profile_id = auth.uid()
  );
$$;

-- True if the currently-authenticated owner owns the building a given bed belongs to.
create or replace function public.owns_bed(p_bed_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.beds bd
    join public.rooms r on r.id = bd.room_id
    join public.buildings b on b.id = r.building_id
    join public.owners o on o.id = b.owner_id
    where bd.id = p_bed_id and o.profile_id = auth.uid()
  );
$$;

-- True if the currently-authenticated owner owns the building a given room belongs to.
create or replace function public.owns_room(p_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.rooms r
    join public.buildings b on b.id = r.building_id
    join public.owners o on o.id = b.owner_id
    where r.id = p_room_id and o.profile_id = auth.uid()
  );
$$;

-- True if the given tenant currently occupies a bed managed by the
-- currently-authenticated owner (used so owners can view/manage their tenants).
create or replace function public.owns_tenant(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.beds bd
    join public.rooms r on r.id = bd.room_id
    join public.buildings b on b.id = r.building_id
    join public.owners o on o.id = b.owner_id
    where bd.tenant_id = p_tenant_id and o.profile_id = auth.uid()
  )
  or exists (
    select 1
    from public.bookings bk
    join public.beds bd on bd.id = bk.bed_id
    join public.rooms r on r.id = bd.room_id
    join public.buildings b on b.id = r.building_id
    join public.owners o on o.id = b.owner_id
    where bk.tenant_id = p_tenant_id and o.profile_id = auth.uid()
  );
$$;


-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- 6a. Generic updated_at stamping (unchanged from original).
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 6b. New-user provisioning (unchanged from original).
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
$$ language plpgsql security definer set search_path = public;

-- 6c. Keep owners.building_count in sync with their live buildings.
create or replace function public.sync_owner_building_count()
returns trigger as $$
declare
  v_owner_id uuid;
begin
  v_owner_id := coalesce(new.owner_id, old.owner_id);
  if v_owner_id is not null then
    update public.owners
    set building_count = (
      select count(*) from public.buildings
      where owner_id = v_owner_id and deleted_at is null
    )
    where id = v_owner_id;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer set search_path = public;

-- 6d. Keep a bed's status consistent with whether it has a tenant assigned,
-- unless it's explicitly under maintenance.
create or replace function public.sync_bed_status_with_tenant()
returns trigger as $$
begin
  if new.status <> 'maintenance' then
    if new.tenant_id is not null then
      new.status := 'occupied';
    elsif new.status = 'occupied' and new.tenant_id is null then
      new.status := 'available';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

-- 6e. When a booking is approved, assign the tenant to the bed and stamp
-- the tenant's current_booking_id/current_bed_id. When a booking that was
-- approved is rejected/cancelled, free the bed back up.
create or replace function public.handle_booking_status_change()
returns trigger as $$
begin
  if new.status = 'approved' and (old.status is distinct from 'approved') then
    update public.beds
    set tenant_id = new.tenant_id, status = 'occupied'
    where id = new.bed_id;

    update public.tenants
    set current_booking_id = new.id, current_bed_id = new.bed_id
    where id = new.tenant_id;
  elsif old.status = 'approved' and new.status in ('rejected','completed') then
    update public.beds
    set tenant_id = null, status = 'available'
    where id = new.bed_id and tenant_id = new.tenant_id;

    update public.tenants
    set current_booking_id = null, current_bed_id = null
    where id = new.tenant_id and current_booking_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 6f. A floor's floor_number can't exceed its building's total_floors.
create or replace function public.validate_floor_number()
returns trigger as $$
declare
  v_total_floors int;
begin
  select total_floors into v_total_floors from public.buildings where id = new.building_id;
  if v_total_floors is not null and new.floor_number > v_total_floors then
    raise exception 'floor_number (%) exceeds building total_floors (%)', new.floor_number, v_total_floors;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Attach/refresh all updated_at triggers (unchanged from original, listed for every table).
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

-- Business-rule automation triggers (new).
drop trigger if exists trg_buildings_sync_owner_count on public.buildings;
create trigger trg_buildings_sync_owner_count
  after insert or update of deleted_at, owner_id or delete on public.buildings
  for each row execute function public.sync_owner_building_count();

drop trigger if exists trg_beds_sync_status on public.beds;
create trigger trg_beds_sync_status
  before insert or update of tenant_id, status on public.beds
  for each row execute function public.sync_bed_status_with_tenant();

drop trigger if exists trg_bookings_status_change on public.bookings;
create trigger trg_bookings_status_change
  after update of status on public.bookings
  for each row execute function public.handle_booking_status_change();

drop trigger if exists trg_floors_validate_number on public.floors;
create trigger trg_floors_validate_number
  before insert or update of floor_number, building_id on public.floors
  for each row execute function public.validate_floor_number();


-- ============================================================================
-- 7. SEED DATA
-- ============================================================================

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


-- ============================================================================
-- 8. ROW LEVEL SECURITY + POLICIES
-- ============================================================================

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

-- Postgres has no `CREATE POLICY IF NOT EXISTS`, so every policy below is
-- dropped first and recreated — this makes the whole block idempotent and
-- safe to re-run.

-- ---- profiles ----
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_super_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_super_admin())
  with check (auth.uid() = id or public.is_super_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ---- owners ----
drop policy if exists "owners_select_own" on public.owners;
create policy "owners_select_own" on public.owners
  for select using (profile_id = auth.uid() or public.is_super_admin());

drop policy if exists "owners_insert_own" on public.owners;
create policy "owners_insert_own" on public.owners
  for insert with check (profile_id = auth.uid());

drop policy if exists "owners_update_own" on public.owners;
create policy "owners_update_own" on public.owners
  for update using (profile_id = auth.uid() or public.is_super_admin())
  with check (profile_id = auth.uid() or public.is_super_admin());

-- ---- tenants ----
drop policy if exists "tenants_select_own_or_managed" on public.tenants;
create policy "tenants_select_own_or_managed" on public.tenants
  for select using (
    profile_id = auth.uid()
    or public.owns_tenant(id)
    or public.is_super_admin()
  );

drop policy if exists "tenants_insert_own" on public.tenants;
create policy "tenants_insert_own" on public.tenants
  for insert with check (profile_id = auth.uid());

drop policy if exists "tenants_update_own_or_managed" on public.tenants;
create policy "tenants_update_own_or_managed" on public.tenants
  for update using (
    profile_id = auth.uid()
    or public.owns_tenant(id)
    or public.is_super_admin()
  )
  with check (
    profile_id = auth.uid()
    or public.owns_tenant(id)
    or public.is_super_admin()
  );

-- ---- buildings ----
drop policy if exists "buildings_read_public" on public.buildings;
create policy "buildings_read_public" on public.buildings
  for select using (true);

drop policy if exists "buildings_insert_own" on public.buildings;
create policy "buildings_insert_own" on public.buildings
  for insert with check (owner_id = public.current_owner_id());

drop policy if exists "buildings_update_own" on public.buildings;
create policy "buildings_update_own" on public.buildings
  for update using (public.owns_building(id) or public.is_super_admin())
  with check (public.owns_building(id) or public.is_super_admin());

drop policy if exists "buildings_delete_own" on public.buildings;
create policy "buildings_delete_own" on public.buildings
  for delete using (public.owns_building(id) or public.is_super_admin());

-- ---- floors ----
drop policy if exists "floors_read_public" on public.floors;
create policy "floors_read_public" on public.floors
  for select using (true);

drop policy if exists "floors_manage_own_building" on public.floors;
create policy "floors_manage_own_building" on public.floors
  for all using (public.owns_building(building_id) or public.is_super_admin())
  with check (public.owns_building(building_id) or public.is_super_admin());

-- ---- rooms ----
drop policy if exists "rooms_read_public" on public.rooms;
create policy "rooms_read_public" on public.rooms
  for select using (true);

drop policy if exists "rooms_manage_own_building" on public.rooms;
create policy "rooms_manage_own_building" on public.rooms
  for all using (public.owns_building(building_id) or public.is_super_admin())
  with check (public.owns_building(building_id) or public.is_super_admin());

-- ---- beds ----
drop policy if exists "beds_read_public" on public.beds;
create policy "beds_read_public" on public.beds
  for select using (true);

drop policy if exists "beds_manage_own_room" on public.beds;
create policy "beds_manage_own_room" on public.beds
  for all using (public.owns_room(room_id) or public.is_super_admin())
  with check (public.owns_room(room_id) or public.is_super_admin());

-- ---- amenities ----
drop policy if exists "amenities_read_public" on public.amenities;
create policy "amenities_read_public" on public.amenities
  for select using (true);

drop policy if exists "amenities_manage_own_building" on public.amenities;
create policy "amenities_manage_own_building" on public.amenities
  for all using (public.owns_building(building_id) or public.is_super_admin())
  with check (public.owns_building(building_id) or public.is_super_admin());

-- ---- bookings ----
drop policy if exists "bookings_read_own" on public.bookings;
create policy "bookings_read_own" on public.bookings
  for select using (
    tenant_id = public.current_tenant_id()
    or public.owns_bed(bed_id)
    or public.is_super_admin()
  );

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings
  for insert with check (tenant_id = public.current_tenant_id());

drop policy if exists "bookings_update_own_or_managed" on public.bookings;
create policy "bookings_update_own_or_managed" on public.bookings
  for update using (
    tenant_id = public.current_tenant_id()
    or public.owns_bed(bed_id)
    or public.is_super_admin()
  )
  with check (
    tenant_id = public.current_tenant_id()
    or public.owns_bed(bed_id)
    or public.is_super_admin()
  );

-- ---- saved_pgs ----
drop policy if exists "saved_pgs_manage_own" on public.saved_pgs;
create policy "saved_pgs_manage_own" on public.saved_pgs
  for all using (tenant_id = public.current_tenant_id() or public.is_super_admin())
  with check (tenant_id = public.current_tenant_id());

-- ---- reviews ----
drop policy if exists "reviews_read_public" on public.reviews;
create policy "reviews_read_public" on public.reviews
  for select using (true);

drop policy if exists "reviews_manage_own" on public.reviews;
create policy "reviews_manage_own" on public.reviews
  for all using (
    tenant_id = public.current_tenant_id()
    or public.is_super_admin()
  )
  with check (tenant_id = public.current_tenant_id());

-- ---- notifications ----
drop policy if exists "notifications_read_own" on public.notifications;
create policy "notifications_read_own" on public.notifications
  for select using (auth.uid() = profile_id or public.is_super_admin());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- ---- payments ----
drop policy if exists "payments_read_own_or_managed" on public.payments;
create policy "payments_read_own_or_managed" on public.payments
  for select using (
    tenant_id = public.current_tenant_id()
    or public.owns_tenant(tenant_id)
    or public.is_super_admin()
  );

drop policy if exists "payments_manage_managed" on public.payments;
create policy "payments_manage_managed" on public.payments
  for all using (public.owns_tenant(tenant_id) or public.is_super_admin())
  with check (public.owns_tenant(tenant_id) or public.is_super_admin());

-- ---- expenses ----
drop policy if exists "expenses_manage_own" on public.expenses;
create policy "expenses_manage_own" on public.expenses
  for all using (owner_id = public.current_owner_id() or public.is_super_admin())
  with check (owner_id = public.current_owner_id());

-- ---- employees ----
drop policy if exists "employees_select_own_or_self" on public.employees;
create policy "employees_select_own_or_self" on public.employees
  for select using (
    owner_id = public.current_owner_id()
    or profile_id = auth.uid()
    or public.is_super_admin()
  );

drop policy if exists "employees_manage_own" on public.employees;
create policy "employees_manage_own" on public.employees
  for all using (owner_id = public.current_owner_id() or public.is_super_admin())
  with check (owner_id = public.current_owner_id());

-- ---- support_tickets ----
drop policy if exists "support_tickets_manage_own" on public.support_tickets;
create policy "support_tickets_manage_own" on public.support_tickets
  for all using (profile_id = auth.uid() or public.is_super_admin())
  with check (profile_id = auth.uid() or public.is_super_admin());

-- ---- subscription_plans ----
drop policy if exists "subscription_plans_read_public" on public.subscription_plans;
create policy "subscription_plans_read_public" on public.subscription_plans
  for select using (true);

drop policy if exists "subscription_plans_manage_admin" on public.subscription_plans;
create policy "subscription_plans_manage_admin" on public.subscription_plans
  for all using (public.is_super_admin())
  with check (public.is_super_admin());

-- ---- owner_subscriptions ----
drop policy if exists "owner_subscriptions_read_own" on public.owner_subscriptions;
create policy "owner_subscriptions_read_own" on public.owner_subscriptions
  for select using (owner_id = public.current_owner_id() or public.is_super_admin());

drop policy if exists "owner_subscriptions_manage_admin" on public.owner_subscriptions;
create policy "owner_subscriptions_manage_admin" on public.owner_subscriptions
  for all using (public.is_super_admin())
  with check (public.is_super_admin());

-- ---- contact_messages ----
drop policy if exists "contact_messages_insert_public" on public.contact_messages;
create policy "contact_messages_insert_public" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_messages_read_admin" on public.contact_messages;
create policy "contact_messages_read_admin" on public.contact_messages
  for select using (public.is_super_admin());

-- ---- platform_settings ----
drop policy if exists "platform_settings_read_public" on public.platform_settings;
create policy "platform_settings_read_public" on public.platform_settings
  for select using (true);

drop policy if exists "platform_settings_manage_admin" on public.platform_settings;
create policy "platform_settings_manage_admin" on public.platform_settings
  for all using (public.is_super_admin())
  with check (public.is_super_admin());

-- ---- activity_logs ----
drop policy if exists "activity_logs_read_own_or_admin" on public.activity_logs;
create policy "activity_logs_read_own_or_admin" on public.activity_logs
  for select using (profile_id = auth.uid() or public.is_super_admin());

drop policy if exists "activity_logs_insert_own" on public.activity_logs;
create policy "activity_logs_insert_own" on public.activity_logs
  for insert with check (profile_id = auth.uid());

-- ---- audit_logs ----
drop policy if exists "audit_logs_read_admin" on public.audit_logs;
create policy "audit_logs_read_admin" on public.audit_logs
  for select using (public.is_super_admin());


-- ============================================================================
-- 9. DASHBOARD VIEWS (Owner module)
-- ============================================================================
-- `security_invoker = true` means these views run with the querying user's
-- own RLS policies (not the view owner's), so an owner querying
-- v_owner_dashboard only ever sees rows their own RLS policies allow.

create or replace view public.v_building_occupancy
with (security_invoker = true) as
select
  b.id as building_id,
  b.owner_id,
  b.name as building_name,
  b.city,
  count(bd.id) as total_beds,
  count(bd.id) filter (where bd.status = 'occupied') as occupied_beds,
  count(bd.id) filter (where bd.status = 'available') as available_beds,
  count(bd.id) filter (where bd.status = 'maintenance') as maintenance_beds,
  case
    when count(bd.id) = 0 then 0
    else round((count(bd.id) filter (where bd.status = 'occupied'))::numeric / count(bd.id) * 100, 2)
  end as occupancy_rate_pct
from public.buildings b
left join public.rooms r on r.building_id = b.id and r.deleted_at is null
left join public.beds bd on bd.room_id = r.id and bd.deleted_at is null
where b.deleted_at is null
group by b.id, b.owner_id, b.name, b.city;

create or replace view public.v_owner_dashboard
with (security_invoker = true) as
select
  o.id as owner_id,
  o.profile_id,
  o.company_name,
  count(distinct b.id) as total_buildings,
  count(distinct r.id) as total_rooms,
  count(distinct bd.id) as total_beds,
  count(distinct bd.id) filter (where bd.status = 'occupied') as occupied_beds,
  count(distinct bd.id) filter (where bd.status = 'available') as available_beds,
  count(distinct bd.tenant_id) filter (where bd.tenant_id is not null) as total_active_tenants,
  coalesce(sum(bd.monthly_rent) filter (where bd.status = 'occupied'), 0) as expected_monthly_revenue
from public.owners o
left join public.buildings b on b.owner_id = o.id and b.deleted_at is null
left join public.rooms r on r.building_id = b.id and r.deleted_at is null
left join public.beds bd on bd.room_id = r.id and bd.deleted_at is null
where o.deleted_at is null
group by o.id, o.profile_id, o.company_name;

create or replace view public.v_owner_monthly_revenue
with (security_invoker = true) as
select
  b.owner_id,
  date_trunc('month', p.payment_date)::date as month,
  coalesce(sum(p.amount) filter (where p.status = 'paid'), 0) as collected,
  coalesce(sum(p.amount) filter (where p.status = 'pending'), 0) as pending,
  coalesce(sum(p.amount) filter (where p.status = 'failed'), 0) as failed
from public.payments p
join public.bookings bk on bk.id = p.booking_id
join public.beds bd on bd.id = bk.bed_id
join public.rooms r on r.id = bd.room_id
join public.buildings b on b.id = r.building_id
where p.deleted_at is null
group by b.owner_id, date_trunc('month', p.payment_date);

create or replace view public.v_owner_pending_payments
with (security_invoker = true) as
select
  p.id as payment_id,
  b.owner_id,
  b.id as building_id,
  t.id as tenant_id,
  t.profile_id as tenant_profile_id,
  p.amount,
  p.payment_date,
  p.status
from public.payments p
join public.tenants t on t.id = p.tenant_id
join public.bookings bk on bk.id = p.booking_id
join public.beds bd on bd.id = bk.bed_id
join public.rooms r on r.id = bd.room_id
join public.buildings b on b.id = r.building_id
where p.status = 'pending' and p.deleted_at is null;


-- ============================================================================
-- 10. GRANTS
-- ============================================================================
-- RLS on the underlying tables still applies to every row returned through
-- these views (thanks to security_invoker), so it's safe to expose them to
-- the standard Supabase roles.

grant select on public.v_building_occupancy to authenticated, anon;
grant select on public.v_owner_dashboard to authenticated;
grant select on public.v_owner_monthly_revenue to authenticated;
grant select on public.v_owner_pending_payments to authenticated;