-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Adds the order of photos/videos inside each portfolio album,
-- set by press-and-drag in the admin page.
-- ============================================================

alter table portfolio_items add column if not exists sort_order integer not null default 0;

-- existing albums keep their upload order
update portfolio_items p
set sort_order = o.n
from (
  select id, row_number() over (partition by lower(car_name) order by created_at) - 1 as n
  from portfolio_items
) o
where p.id = o.id and p.sort_order = 0;
