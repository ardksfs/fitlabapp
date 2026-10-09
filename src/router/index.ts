import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  { 
  path: '/login', 
  name: 'Auth',
  component: () => import('../views/auth/Auth.vue') 
},
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: () => import('../views/admin/Dashboard.vue') },
      { path: 'members', component: () => import('../views/admin/Members.vue') },
      { path: 'membership-plans', component: () => import('../views/admin/MemberPlans.vue') },
      { path: 'trainers', component: () => import('../views/admin/Trainers.vue') },
      { path: 'attendance', component: () => import('../views/admin/Attendance.vue') },
      { path: 'payments', component: () => import('../views/admin/Payments.vue') },
      { path: 'equipment', component: () => import('../views/admin/Equipment.vue') },
      { path: 'analytics', component: () => import('../views/admin/Analytics.vue') },
      { path: 'reports', component: () => import('../views/admin/Reports.vue') },
      { path: 'settings', component: () => import('../views/admin/Settings.vue') },
    ]
  },
  // for add route /pt dan /user 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;