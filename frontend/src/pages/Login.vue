<template>
  <div class="login-container">
    <h2>{{ $t('login') }}</h2>
    <form @submit.prevent="onLogin">
      <div>
        <label>{{ $t('account') || '账号' }}</label>
        <input v-model="account" required placeholder="请输入账号" />
      </div>
      <div>
        <label>{{ $t('password') || '密码' }}</label>
        <input type="password" v-model="password" required placeholder="请输入密码" />
      </div>
      <button type="submit">{{ $t('login') }}</button>
    </form>
    <p>
      <router-link to="/register">{{ $t('register') }}</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const account = ref('');
const password = ref('');
const router = useRouter();

function onLogin() {
  // TODO: 登录逻辑，调用API
  alert('登录成功（示例）');
  router.push('/');
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.login-container label {
  display: block;
  margin-bottom: 0.5rem;
}
.login-container input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
