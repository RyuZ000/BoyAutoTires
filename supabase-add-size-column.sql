-- ============================================================
-- Run this once in SQL Editor -> New query -> Run
-- Adds a dedicated "size" column (e.g. "265/60R18") used for
-- searching and sorting on the tires page.
-- ============================================================

alter table products add column if not exists size text;
