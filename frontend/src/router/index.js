import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'LanguageSelect', component: () => import('../pages/LanguageSelect.vue') },
  { path: '/language-select', name: 'LanguageSelectPage', component: () => import('../pages/LanguageSelect.vue') },
  { path: '/login-register', name: 'LoginRegister', component: () => import('../pages/LoginRegister.vue') },
  { path: '/admin-login', name: 'AdminLogin', component: () => import('../pages/AdminLogin.vue') },
  { path: '/home', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../pages/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue') },
  { path: '/group', name: 'GroupPurchase', component: () => import('../pages/GroupPurchase.vue') },
  { path: '/share', name: 'Share', component: () => import('../pages/Share.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../pages/Profile.vue') },
  { path: '/message', name: 'Message', component: () => import('../pages/Message.vue') },
  { path: '/vip', name: 'VIP', component: () => import('../pages/VIP.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../pages/Admin.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
