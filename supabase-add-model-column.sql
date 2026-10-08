-- ============================================================
-- Run in SQL Editor -> New query -> Run (safe to run again)
-- Adds a "model" column for alloy wheels (e.g. BLAZE).
-- For wheels the product name is the brand (e.g. JAGER).
-- ============================================================

alter table products add column if not exists model text;
