/* ============================================================
   Portfolio albums, shared by portfolio.html and admin.html.
   Every portfolio_items row has a car_name; rows with the same car
   (ignoring case and spaces, so "Tank300" = "Tank 300") form one album.
   Load after search.js.
   ============================================================ */

function carKey(name) {
  return (name || '').toLowerCase().replace(/[\s\-_./]+/g, '');
}

// items: rows sorted newest first. Returns albums sorted by their newest item:
// { key, name, items, photos, videos, cover }
// Inside an album, items follow sort_order (set by dragging in admin); the first one is the cover.
function groupPortfolio(items) {
  const albums = new Map();
  for (const item of items) {
    const key = carKey(item.car_name);
    if (!albums.has(key)) albums.set(key, { key, name: (item.car_name || '').trim(), items: [] });
    albums.get(key).items.push(item);
  }
  return [...albums.values()].map(a => {
    const items = [...a.items].sort((x, y) =>
      (x.sort_order || 0) - (y.sort_order || 0) || String(x.created_at || '').localeCompare(String(y.created_at || '')));
    return {
      ...a,
      items,
      photos: items.filter(i => i.media_type === 'photo'),
      videos: items.filter(i => i.media_type === 'video'),
      cover: items[0],
    };
  });
}
