-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Portfolio (ผลงาน) photos and videos, managed from the admin page.
--   * table  portfolio_items : one row per photo / video, with the car name
--   * bucket portfolio       : the uploaded files (public, max 50 MB per file)
-- The shop's existing photos/video are added as the first items so the
-- page isn't empty; their car names can be filled in from the admin page.
-- ============================================================

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  media_type text not null check (media_type in ('photo', 'video')),
  url text not null,
  car_name text not null default '',
  created_at timestamptz not null default now()
);

alter table portfolio_items enable row level security;

drop policy if exists "Public can view portfolio" on portfolio_items;
create policy "Public can view portfolio"
on portfolio_items for select
using (true);

drop policy if exists "Staff can insert portfolio" on portfolio_items;
create policy "Staff can insert portfolio"
on portfolio_items for insert
to authenticated
with check (true);

drop policy if exists "Staff can update portfolio" on portfolio_items;
create policy "Staff can update portfolio"
on portfolio_items for update
to authenticated
using (true);

drop policy if exists "Staff can delete portfolio" on portfolio_items;
create policy "Staff can delete portfolio"
on portfolio_items for delete
to authenticated
using (true);

-- storage bucket for uploaded files
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 52428800, array['image/*', 'video/*'])
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio files" on storage.objects;
create policy "Public can view portfolio files"
on storage.objects for select
using (bucket_id = 'portfolio');

drop policy if exists "Staff can upload portfolio files" on storage.objects;
create policy "Staff can upload portfolio files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Staff can delete portfolio files" on storage.objects;
create policy "Staff can delete portfolio files"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio');

-- the photos/video already on the site (only if the table is still empty)
insert into portfolio_items (media_type, url, created_at)
select v.media_type, v.url, now() - (v.n * interval '1 second')
from (values
  ('video', '/Video%20Somza/Somza1.mp4', 0),
  ('photo', '/Photo%20Somza/Somza1.jpg', 1),
  ('photo', '/Photo%20Somza/Somza2.jpg', 2),
  ('photo', '/Photo%20Somza/Somza3.jpg', 3),
  ('photo', '/Photo%20Somza/Somza4.jpg', 4),
  ('photo', '/Photo%20Somza/Somza5.jpg', 5),
  ('photo', '/Photo%20Somza/Somza6.jpg', 6),
  ('photo', '/Photo%20Somza/Somza7.jpg', 7),
  ('photo', '/Photo%20Somza/Somza8.jpg', 8),
  ('photo', '/Photo%20Somza/Somza9.jpg', 9)
) as v(media_type, url, n)
where not exists (select 1 from portfolio_items);
