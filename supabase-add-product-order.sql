-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Order of products on each category page, set by press-and-drag
-- in the admin page. Existing products keep today's order:
-- tires by size, the other categories newest first.
-- ============================================================

alter table products add column if not exists sort_order integer;

update products p
set sort_order = o.n
from (
  select id, row_number() over (
    partition by category
    order by
      case when category = 'tires' then size end asc nulls last,
      created_at desc
  ) - 1 as n
  from products
) o
where p.id = o.id and p.sort_order is null;
