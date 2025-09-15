import { createRouter, createWebHashHistory } from 'vue-router';

// User routes
const userRoutes = [
  { path: '/', name: 'Home', component: () => import('../pages/user/Home.vue') },
  { path: '/login', name: 'Login', component: () => import('../pages/user/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../pages/user/Register.vue') },
  { path: '/group', name: 'GroupPurchase', component: () => import('../pages/user/GroupPurchase.vue') },
  { path: '/wallet', name: 'Wallet', component: () => import('../pages/user/Wallet.vue') },
  { path: '/vip', name: 'VIP', component: () => import('../pages/user/VIP.vue') },
  { path: '/invite', name: 'Invite', component: () => import('../pages/user/Invite.vue') },
  // Additional user pages
  { path: '/language-select', name: 'LanguageSelect', component: () => import('../pages/user/LanguageSelect.vue') },
  { path: '/login-register', name: 'LoginRegister', component: () => import('../pages/user/LoginRegister.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../pages/user/Profile.vue') },
  { path: '/message', name: 'Message', component: () => import('../pages/user/Message.vue') },
  { path: '/share', name: 'Share', component: () => import('../pages/user/Share.vue') },
];

// Admin routes
const adminRoutes = [
  { path: '/admin-login', name: 'AdminLogin', component: () => import('../pages/admin/AdminLogin.vue') },
  { 
    path: '/admin', 
    name: 'AdminDashboard', 
    component: () => import('../pages/admin/AdminDashboard.vue'),
    meta: { requiresAdmin: true }
  },
];

const routes = [...userRoutes, ...adminRoutes];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Admin authentication guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    // Check if admin is logged in (you can customize this logic based on your auth implementation)
    const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!adminToken) {
      next('/admin-login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
