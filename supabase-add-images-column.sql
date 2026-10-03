-- ============================================================
-- Run this once in SQL Editor -> New query -> Run
-- Adds an "image_urls" column so each product can have
-- multiple images. "image_url" is kept and always holds the
-- first (cover) image, so older code keeps working.
-- ============================================================

alter table products add column if not exists image_urls text[] not null default '{}';

-- Copy existing single images into the new column
update products
set image_urls = array[image_url]
where image_url is not null and cardinality(image_urls) = 0;
