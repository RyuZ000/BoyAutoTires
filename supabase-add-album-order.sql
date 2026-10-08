-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Order of the cars (albums) on the portfolio page, set by
-- press-and-drag in the admin page. Every row of one car carries
-- the same album_order. Existing cars keep today's order (newest first).
-- ============================================================

alter table portfolio_items add column if not exists album_order integer;

update portfolio_items p
set album_order = o.n
from (
  select car_key, (row_number() over (order by newest desc)) - 1 as n
  from (
    select lower(regexp_replace(car_name, '[\s\-_./]+', '', 'g')) as car_key, max(created_at) as newest
    from portfolio_items
    group by 1
  ) albums
) o
where lower(regexp_replace(p.car_name, '[\s\-_./]+', '', 'g')) = o.car_key
  and p.album_order is null;
