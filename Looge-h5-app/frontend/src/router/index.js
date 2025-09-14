import { createRouter, createWebHistory } from 'vue-router';

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
  // New pages
  { path: '/wallet', name: 'Wallet', component: () => import('../pages/Wallet.vue') },
  { path: '/my-prizes', name: 'MyPrizes', component: () => import('../pages/MyPrizes.vue') },
  { path: '/team', name: 'Team', component: () => import('../pages/Team.vue') },
  { path: '/recharge', name: 'Recharge', component: () => import('../pages/Recharge.vue') },
  { path: '/withdraw', name: 'Withdraw', component: () => import('../pages/Withdraw.vue') },
  // Transaction history with optional type filter
  { path: '/transaction-history', name: 'TransactionHistory', component: () => import('../pages/TransactionHistory.vue') },
  // Edit profile 
  { path: '/edit-profile', name: 'EditProfile', component: () => import('../pages/EditProfile.vue') },
  // Delivery address form
  { path: '/delivery-address/:prizeId', name: 'DeliveryAddress', component: () => import('../pages/DeliveryAddress.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
