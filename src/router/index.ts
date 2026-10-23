
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Auth',
    component: () => import('../views/auth/Auth.vue'),
  },

  // USER
  {
    path: '/user',
    component: () => import('../layouts/UserLayout.vue'),
    meta: { requiresAuth: true, role: 'user' },
    children: [
      {
        path: '',
        redirect: '/user/dashboard',
      },
      {
        path: 'dashboard',
        component: () => import('../views/user/UserDashboard.vue'),
      },
    ],
  },

  // PERSONAL TRAINER
  {
    path: '/pt',
    component: () => import('../layouts/PrivateTLayout.vue'),
    meta: { requiresAuth: true, role: 'pt' },
    children: [
      {
        path: '',
        redirect: '/pt/dashboard',
      },
      {
        path: 'dashboard',
        component: () => import('../views/pt/PTDashboard.vue'),
      },
    ],
  },

  // ADMIN
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      {
        path: 'dashboard',
        component: () => import('../views/admin/Dashboard.vue'),
      },
      {
        path: 'members',
        component: () => import('../views/admin/Members.vue'),
      },
      {
        path: 'membership-plans',
        component: () => import('../views/admin/MemberPlans.vue'),
      },
      {
        path: 'trainers',
        component: () => import('../views/admin/Trainers.vue'),
      },
      {
        path: 'attendance',
        component: () => import('../views/admin/Attendance.vue'),
      },
      {
        path: 'payments',
        component: () => import('../views/admin/Payments.vue'),
      },
      {
        path: 'equipment',
        component: () => import('../views/admin/Equipment.vue'),
      },
      {
        path: 'analytics',
        component: () => import('../views/admin/Analytics.vue'),
      },
      {
        path: 'reports',
        component: () => import('../views/admin/Reports.vue'),
      },
      {
        path: 'settings',
        component: () => import('../views/admin/Settings.vue'),
      },
    ],
  },

  // HALAMAN 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

function normalizeRole(value: unknown): string {
  const role = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  if (['user', 'member', 'gym_member'].includes(role)) {
    return 'user';
  }

  if (
    ['pt', 'trainer', 'personal_trainer', 'personaltrainer'].includes(role)
  ) {
    return 'pt';
  }

  if (['admin', 'administrator'].includes(role)) {
    return 'admin';
  }

  return role;
}

function getDashboardPath(role: string): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'pt') return '/pt/dashboard';
  if (role === 'user') return '/user/dashboard';

  return '/login';
}

router.beforeEach((to) => {
  if (to.path === '/login') {
    return true;
  }

  let session: Record<string, any> | null = null;

  try {
    const storedSession = localStorage.getItem('fitlab_session');
    session = storedSession ? JSON.parse(storedSession) : null;
  } catch {
    localStorage.removeItem('fitlab_session');
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !session) {
    return '/login';
  }

  if (!session) {
    return true;
  }

  const role = normalizeRole(
    session.role ??
    session.user?.role ??
    session.account?.role
  );

  const requiredRole = to.meta.role
    ? normalizeRole(to.meta.role)
    : '';

  if (requiredRole && role !== requiredRole) {
    return getDashboardPath(role);
  }

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !['admin', 'pt', 'user'].includes(role)
  ) {
    return '/login';
  }

  return true;
});

export default router;
