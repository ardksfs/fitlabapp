/**
 * Shared helpers for the browser-side login session.
 *
 * NOTE: the session lives in localStorage and is therefore NOT a security
 * boundary. Real role enforcement requires a backend that issues and verifies
 * signed sessions/tokens. These helpers only keep client behaviour consistent.
 */
export const SESSION_KEY = 'fitlab_session';

export type StoredSession = Record<string, any>;

export function normalizeRole(value: unknown): string {
  const role = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  if (['user', 'member', 'gym_member'].includes(role)) return 'user';
  if (['pt', 'trainer', 'personal_trainer', 'personaltrainer'].includes(role)) return 'pt';
  if (['admin', 'administrator'].includes(role)) return 'admin';

  return role;
}

export function getDashboardPath(role: string): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'pt') return '/pt/dashboard';
  if (role === 'user') return '/user/dashboard';

  return '/login';
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
}

/** Reads the stored session. Corrupt or non-object values are discarded. */
export function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      clearSession();
      return null;
    }

    return parsed as StoredSession;
  } catch {
    clearSession();
    return null;
  }
}

export function getSessionRole(session: StoredSession | null): string {
  if (!session) return '';
  return normalizeRole(session.role ?? session.user?.role ?? session.account?.role);
}
