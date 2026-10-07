/* ============================================================
   Search matching shared by the shop pages, the portfolio page
   and the admin page. Load before products.js.
   ============================================================ */

// true when `text` contains `query`, ignoring case, spaces and - _ . /
// so "tank300" finds "Tank 300" and "toyotarevo" finds "Toyota Revo"
function textMatches(text, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;
  const t = (text || '').toLowerCase();
  if (t.includes(q)) return true;
  const compact = s => s.replace(/[\s\-_./]+/g, '');
  const cq = compact(q);
  return cq !== '' && compact(t).includes(cq);
}
