-- English description for products (optional; the English site shows the Thai one when empty).
-- Safe to run more than once.
alter table public.products add column if not exists description_en text;
