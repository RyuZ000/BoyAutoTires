-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Promotions (โปรโมชั่น) and blog articles (บทความ), managed from the admin page.
--   * table posts : one row per post; type 'promo' shows on /promotions, 'blog' on /blog
--   * photos go in the existing "product-images" bucket (folders promo/ and blog/)
--   * ends_on (promotions only, optional): the last day it shows on the website
-- ============================================================

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('promo', 'blog')),
  title text not null,
  body text,
  image_urls text[] not null default '{}',
  ends_on date,
  sort_order integer,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

drop policy if exists "Public can view posts" on posts;
create policy "Public can view posts"
on posts for select
using (true);

drop policy if exists "Staff can insert posts" on posts;
create policy "Staff can insert posts"
on posts for insert
to authenticated
with check (true);

drop policy if exists "Staff can update posts" on posts;
create policy "Staff can update posts"
on posts for update
to authenticated
using (true);

drop policy if exists "Staff can delete posts" on posts;
create policy "Staff can delete posts"
on posts for delete
to authenticated
using (true);
