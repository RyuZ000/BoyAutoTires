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
// Photos come before videos inside an album; cover = first photo, else first video.
function groupPortfolio(items) {
  const albums = new Map();
  for (const item of items) {
    const key = carKey(item.car_name);
    if (!albums.has(key)) albums.set(key, { key, name: (item.car_name || '').trim(), items: [] });
    albums.get(key).items.push(item);
  }
  return [...albums.values()].map(a => {
    const photos = a.items.filter(i => i.media_type === 'photo');
    const videos = a.items.filter(i => i.media_type === 'video');
    return { ...a, items: [...photos, ...videos], photos, videos, cover: photos[0] || videos[0] };
  });
}
