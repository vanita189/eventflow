-- ============================================================
-- PUB MANAGER SAAS — COMPLETE SUPABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- DROP existing tables if you want fresh start
drop table if exists event_packages cascade;
drop table if exists bookings cascade;
drop table if exists staff cascade;
drop table if exists events cascade;
drop table if exists subscriptions cascade;
drop table if exists tenants cascade;

-- TENANTS (Pub profiles)
create table tenants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  name text not null,
  email text,
  phone text,
  description text,
  address text,
  lat decimal,
  lng decimal,
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

-- SUBSCRIPTIONS
create table subscriptions (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references tenants(id) on delete cascade unique,
  plan text not null default 'trial' check (plan in ('trial','starter','pro','enterprise')),
  status text not null default 'trial' check (status in ('trial','active','cancelled','expired','pending_payment')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz default now()
);

-- EVENTS
create table events (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references tenants(id) on delete cascade,
  title text not null,
  description text,
  date date not null,
  time time not null,
  capacity int not null default 100,
  status text default 'upcoming' check (status in ('upcoming','completed','cancelled')),
  location_address text,
  lat decimal,
  lng decimal,
  created_at timestamptz default now()
);

-- EVENT PACKAGES
create table event_packages (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade,
  name text not null,
  description text,
  price decimal not null default 0,
  capacity int,
  icon text default '🎟️',
  includes text[],
  created_at timestamptz default now()
);

-- BOOKINGS
create table bookings (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete cascade,
  package_id uuid references event_packages(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  tickets int not null default 1,
  total_amount decimal not null default 0,
  status text default 'confirmed' check (status in ('confirmed','pending','cancelled')),
  notes text,
  created_at timestamptz default now()
);

-- STAFF
create table staff (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null,
  phone text,
  status text default 'active' check (status in ('active','off-duty')),
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────

alter table tenants enable row level security;
alter table subscriptions enable row level security;
alter table events enable row level security;
alter table event_packages enable row level security;
alter table bookings enable row level security;
alter table staff enable row level security;

-- Tenants: owner only
create policy "tenant_owner" on tenants for all using (auth.uid() = user_id);

-- Subscriptions: via tenant
create policy "sub_owner" on subscriptions for all using (
  tenant_id in (select id from tenants where user_id = auth.uid())
);

-- Events: via tenant
create policy "events_owner" on events for all using (
  tenant_id in (select id from tenants where user_id = auth.uid())
);

-- Event packages: via event's tenant
create policy "packages_owner" on event_packages for all using (
  event_id in (select id from events where tenant_id in (select id from tenants where user_id = auth.uid()))
);

-- Bookings: via tenant
create policy "bookings_owner" on bookings for all using (
  tenant_id in (select id from tenants where user_id = auth.uid())
);

-- Staff: via tenant
create policy "staff_owner" on staff for all using (
  tenant_id in (select id from tenants where user_id = auth.uid())
);

-- ── DONE ────────────────────────────────────────────────────
-- After running this SQL:
-- 1. Go to your project src/lib/supabase.js
-- 2. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY
-- 3. Run: npm install && npm run dev

-- ── Additional columns (run if upgrading from old version) ───
alter table tenants add column if not exists logo_url text;
alter table events  add column if not exists image_url text;

-- ── Storage bucket for uploads ───────────────────────────────
-- Run this in Supabase Dashboard > Storage > New Bucket
-- Name: uploads
-- Public: true
