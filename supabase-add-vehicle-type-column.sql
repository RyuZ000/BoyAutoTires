-- ============================================================
-- Run this once in SQL Editor -> New query -> Run
-- Adds a "vehicle_type" column used by the filter sidebar on
-- the shock page: 'pickup' = pickup / SUV / van, 'sedan' = sedan.
-- ============================================================

alter table products add column if not exists vehicle_type text
  check (vehicle_type in ('pickup', 'sedan'));
