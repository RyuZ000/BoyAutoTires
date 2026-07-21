-- ============================================================
-- Run this AFTER creating the "product-images" bucket
-- (Storage -> New bucket -> name: product-images -> Public: ON)
-- Then run this in SQL Editor -> New query -> Run
-- ============================================================

-- Anyone visiting the website can VIEW/load product images
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Only logged-in staff can UPLOAD new images
create policy "Staff can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

-- Only logged-in staff can REPLACE images
create policy "Staff can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images');

-- Only logged-in staff can DELETE images
create policy "Staff can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
