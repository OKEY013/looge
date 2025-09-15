import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('../pages/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../pages/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue') },
  { path: '/group', name: 'GroupPurchase', component: () => import('../pages/GroupPurchase.vue') },
  { path: '/share', name: 'Share', component: () => import('../pages/Share.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../pages/Profile.vue') },
  { path: '/message', name: 'Message', component: () => import('../pages/Message.vue') },
  { path: '/vip', name: 'VIP', component: () => import('../pages/VIP.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../pages/Admin.vue') },
  { path: '/wallet', name: 'Wallet', component: () => import('../pages/Wallet.vue') },
  { path: '/invite', name: 'Invite', component: () => import('../pages/Invite.vue') },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
