-- ============================================================
-- Run this in SQL Editor -> New query -> Run
-- Adds 'ev' (electric car) as a vehicle_type for the shock page
-- filter. Safe to run more than once.
-- ============================================================

alter table products drop constraint if exists products_vehicle_type_check;
alter table products add constraint products_vehicle_type_check
  check (vehicle_type in ('pickup', 'sedan', 'ev'));
