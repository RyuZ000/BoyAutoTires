-- ============================================================
-- Run this in SQL Editor -> New query -> Run
-- Adds the 'other' product category (/other page, "Other" tab in admin).
-- Safe to run more than once.
-- ============================================================

alter table products drop constraint if exists products_category_check;
alter table products add constraint products_category_check
  check (category in ('tires', 'wheels', 'shock', 'brake', 'other'));
