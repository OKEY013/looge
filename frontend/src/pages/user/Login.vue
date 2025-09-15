<template>
  <div class="gradient-container gradient-fade-in">
    <div class="gradient-card">
      <h2 class="gradient-title">{{ $t('login') || 'Login' }}</h2>
      <form @submit.prevent="onLogin" class="gradient-form">
        <div class="gradient-field">
          <label class="gradient-label">{{ $t('account') || '账号' }}</label>
          <input v-model="account" required placeholder="请输入账号" class="gradient-input" />
        </div>
        <div class="gradient-field">
          <label class="gradient-label">{{ $t('password') || '密码' }}</label>
          <input type="password" v-model="password" required placeholder="请输入密码" class="gradient-input" />
        </div>
        <button type="submit" class="gradient-button gradient-button-full">{{ $t('login') || 'Login' }}</button>
      </form>
      <div class="quick-links text-center mt-3">
        <router-link to="/register" class="gradient-link">{{ $t('register') || 'Register' }}</router-link>
        <span class="mx-2">|</span>
        <router-link to="/language-select" class="gradient-link">{{ $t('switchLang') || '切换语言' }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const account = ref('');
const password = ref('');
const router = useRouter();

function onLogin() {
  // Simple demo login - in real app this would call backend API
  localStorage.setItem('userToken', 'demo-token-' + Date.now());
  localStorage.setItem('userName', account.value);
  alert('登录成功！欢迎来到Looge幸运团购');
  router.push('/group');
}
</script>

<style scoped>
.mx-2 {
  margin: 0 0.5rem;
  color: var(--text-light);
}

.quick-links {
  padding-top: 1rem;
  border-top: 1px solid rgba(135, 206, 235, 0.2);
}
</style>
