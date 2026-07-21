-- ============================================================
-- Run this once in Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('tires', 'wheels', 'shock', 'brake')),
  name text not null,
  description text,
  price numeric,
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- Turn on Row Level Security (required so the public anon key
-- can only do what the policies below explicitly allow)
alter table products enable row level security;

-- Anyone visiting the website can VIEW products
create policy "Public can view products"
on products for select
using (true);

-- Only logged-in staff can ADD products
create policy "Staff can insert products"
on products for insert
to authenticated
with check (true);

-- Only logged-in staff can EDIT products
create policy "Staff can update products"
on products for update
to authenticated
using (true);

-- Only logged-in staff can DELETE products
create policy "Staff can delete products"
on products for delete
to authenticated
using (true);

-- ============================================================
-- After running this, go to:
-- Authentication -> Providers -> Email -> turn OFF "Allow new
-- users to sign up" (so random people can't create accounts).
--
-- Then go to Authentication -> Users -> Add user, and manually
-- create your 1-2 staff accounts (email + password).
-- ============================================================
