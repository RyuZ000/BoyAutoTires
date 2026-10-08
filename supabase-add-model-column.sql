-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Alloy wheel details. For wheels the product name is the brand
-- (e.g. JAGER); series (e.g. LITETECH), model (e.g. BLAZE) and color are extra.
-- ============================================================

alter table products add column if not exists model text;
alter table products add column if not exists series text;
alter table products add column if not exists color text;
