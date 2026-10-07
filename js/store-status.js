/* ============================================================
   Shop open/closed status, shared by contact.html and admin.html.
   Requires supabase-config.js (defines `sb`).

   The status follows STORE_HOURS (Bangkok time) unless staff set
   "open today" / "closed today" in the admin page. That override is
   stored in site_settings.store_status with today's date, so it
   expires on its own the next day.
   ============================================================ */

const STORE_HOURS = { open: '08:30', close: '19:00' };
const STORE_TZ = 'Asia/Bangkok';

function storeHoursText() {
  return `${STORE_HOURS.open} – ${STORE_HOURS.close}`;
}

// today's date and the current minute of the day, in the shop's time zone
function storeNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: STORE_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date()).map(p => [p.type, p.value])
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// setting = the stored value ({ mode, date }) or null
// returns { open: boolean, manual: boolean }
function getStoreStatus(setting) {
  const now = storeNow();
  if (setting && (setting.mode === 'open' || setting.mode === 'closed') && setting.date === now.date) {
    return { open: setting.mode === 'open', manual: true };
  }
  const open = now.minutes >= toMinutes(STORE_HOURS.open) && now.minutes < toMinutes(STORE_HOURS.close);
  return { open, manual: false };
}

// returns the stored setting, or null if it isn't set / the table doesn't exist yet
async function fetchStoreSetting() {
  const { data, error } = await sb
    .from('site_settings')
    .select('value')
    .eq('key', 'store_status')
    .maybeSingle();
  if (error) {
    console.error('fetchStoreSetting error:', error);
    return null;
  }
  return data ? data.value : null;
}

// mode: 'auto' | 'open' | 'closed' (staff only, enforced by RLS)
async function saveStoreMode(mode) {
  const value = mode === 'auto' ? { mode } : { mode, date: storeNow().date };
  return sb.from('site_settings').upsert({ key: 'store_status', value, updated_at: new Date().toISOString() });
}
