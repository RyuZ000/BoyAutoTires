-- English version of promotions / blog articles (optional; the site shows Thai when empty).
-- Safe to run more than once.
alter table public.posts add column if not exists title_en text;
alter table public.posts add column if not exists body_en text;
