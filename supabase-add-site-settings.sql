-- ============================================================
-- Run this once in SQL Editor -> New query -> Run
-- Adds a small key/value "site_settings" table. First use: the
-- shop open/closed switch in the admin page (key 'store_status').
--   value = {"mode": "auto"}                          follow opening hours
--   value = {"mode": "open"|"closed", "date": "YYYY-MM-DD"}
--           forced for that day only (Bangkok time), back to auto the next day
-- ============================================================

create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

-- Anyone visiting the website can READ settings (the contact page shows the status)
create policy "Public can view site settings"
on site_settings for select
using (true);

-- Only logged-in staff can change them
create policy "Staff can insert site settings"
on site_settings for insert
to authenticated
with check (true);

create policy "Staff can update site settings"
on site_settings for update
to authenticated
using (true);

insert into site_settings (key, value)
values ('store_status', '{"mode": "auto"}')
on conflict (key) do nothing;
