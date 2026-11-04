
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { readSession } from '../utils/session';
import { resolveNavigation } from './guard';

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

  // Member-only event page (opened from the ad popup and notifications)
  {
    path: '/member-event',
    name: 'MemberEvent',
    component: () => import('../views/MemberEventPage.vue'),
    meta: { requiresAuth: true, role: 'user' },
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
      
      /*
      {
        path: 'equipment',
        component: () => import('../views/admin/Equipment.vue'),
      }, */

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

router.beforeEach((to) => resolveNavigation(to, readSession()));

export default router;
