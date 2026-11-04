import { getDashboardPath, getSessionRole, normalizeRole, type StoredSession } from '../utils/session';

interface GuardTarget {
  path: string;
  meta: Record<string, unknown>;
  matched: Array<{ meta: Record<string, unknown> }>;
}

/**
 * Decides where a navigation should go. Returns `true` to allow it or a path to
 * redirect to. Pure function so it can be unit-tested without a router.
 */
export function resolveNavigation(to: GuardTarget, session: StoredSession | null): true | string {
  if (to.path === '/login') return true;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!session) {
    return requiresAuth ? '/login' : true;
  }

  const role = getSessionRole(session);
  const requiredRole = to.meta.role ? normalizeRole(to.meta.role) : '';

  if (requiredRole && role !== requiredRole) {
    return getDashboardPath(role);
  }

  if (requiresAuth && !['admin', 'pt', 'user'].includes(role)) {
    return '/login';
  }

  return true;
}
