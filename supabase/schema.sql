-- ============================================================================
-- CABINET NOUHA - SUPABASE SCHEMA
-- Tables: available_slots, blocked_dates, appointments
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- TABLE: available_slots
-- Represents bookable time slots created/managed by the clinic owner.
-- ----------------------------------------------------------------------------
create table if not exists public.available_slots (
  id uuid primary key default uuid_generate_v4(),
  slot_date date not null,
  slot_time time not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_slot unique (slot_date, slot_time)
);

create index if not exists idx_available_slots_date on public.available_slots (slot_date);
create index if not exists idx_available_slots_booked on public.available_slots (is_booked);

-- ----------------------------------------------------------------------------
-- TABLE: blocked_dates
-- Full days the clinic is closed (vacation, holidays, custom blocks).
-- ----------------------------------------------------------------------------
create table if not exists public.blocked_dates (
  id uuid primary key default uuid_generate_v4(),
  blocked_date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_blocked_dates_date on public.blocked_dates (blocked_date);

-- ----------------------------------------------------------------------------
-- TABLE: appointments
-- Booking submissions from website visitors.
-- ----------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  service text not null,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  slot_id uuid references public.available_slots(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_date on public.appointments (appointment_date);
create index if not exists idx_appointments_status on public.appointments (status);
create index if not exists idx_appointments_phone on public.appointments (phone);
create index if not exists idx_appointments_name on public.appointments (first_name, last_name);

-- ----------------------------------------------------------------------------
-- FUNCTION + TRIGGERS: auto-update updated_at
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_appointments_updated_at on public.appointments;
create trigger trg_appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

drop trigger if exists trg_available_slots_updated_at on public.available_slots;
create trigger trg_available_slots_updated_at
  before update on public.available_slots
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.available_slots enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.appointments enable row level security;

-- available_slots: public can read only non-booked, future slots
drop policy if exists "Public can view available slots" on public.available_slots;
create policy "Public can view available slots"
  on public.available_slots
  for select
  to anon
  using (is_booked = false and slot_date >= current_date);

-- available_slots: only service_role (admin) can insert/update/delete
drop policy if exists "Service role manages slots" on public.available_slots;
create policy "Service role manages slots"
  on public.available_slots
  for all
  to service_role
  using (true)
  with check (true);

-- Allow anon to update is_booked when creating an appointment (handled via service role in API, kept restrictive)
-- No direct anon write access to available_slots; all writes go through API routes using service role key.

-- blocked_dates: public can read (to disable dates in calendar)
drop policy if exists "Public can view blocked dates" on public.blocked_dates;
create policy "Public can view blocked dates"
  on public.blocked_dates
  for select
  to anon
  using (true);

drop policy if exists "Service role manages blocked dates" on public.blocked_dates;
create policy "Service role manages blocked dates"
  on public.blocked_dates
  for all
  to service_role
  using (true)
  with check (true);

-- appointments: anon can INSERT (booking form submission) but cannot read/update/delete
drop policy if exists "Public can create appointments" on public.appointments;
create policy "Public can create appointments"
  on public.appointments
  for insert
  to anon
  with check (true);

drop policy if exists "Service role manages appointments" on public.appointments;
create policy "Service role manages appointments"
  on public.appointments
  for all
  to service_role
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- SEED DATA (optional - example available slots for the next 14 days)
-- Uncomment to seed sample data for development/testing.
-- ----------------------------------------------------------------------------
-- insert into public.available_slots (slot_date, slot_time)
-- select d::date, t::time
-- from generate_series(current_date, current_date + interval '13 days', interval '1 day') d
-- cross join (values ('09:00'), ('10:00'), ('11:00'), ('14:00'), ('15:00'), ('16:00')) as times(t)
-- where extract(isodow from d) not in (7) -- exclude Sundays
-- on conflict (slot_date, slot_time) do nothing;
