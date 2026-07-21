/* ============================================================
   Auth helpers - shared across every page
   Requires supabase-config.js to be loaded first (defines `sb`)
   ============================================================ */

// Show/hide the staff-corner buttons depending on login state
async function initAuthUI() {
  const { data: { session } } = await sb.auth.getSession();

  const loginBtn = document.getElementById('staff-login-link');
  const adminBtn = document.getElementById('staff-admin-link');
  const logoutBtn = document.getElementById('staff-logout-link');

  const isLoggedIn = !!session;

  if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'inline-flex';
  if (adminBtn) adminBtn.style.display = isLoggedIn ? 'inline-flex' : 'none';
  if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'inline-flex' : 'none';

  return isLoggedIn;
}

async function staffLogout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}

// Keep the corner buttons in sync if the session changes in this tab
sb.auth.onAuthStateChange(() => initAuthUI());

document.addEventListener('DOMContentLoaded', initAuthUI);
