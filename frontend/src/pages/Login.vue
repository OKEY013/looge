<template>
  <div class="login-container">
    <div>
      <h2>{{ $t('login') || 'Login' }}</h2>
      <form @submit.prevent="onLogin">
        <div>
          <label>{{ $t('account') || '账号' }}</label>
          <input v-model="account" required placeholder="请输入账号" />
        </div>
        <div>
          <label>{{ $t('password') || '密码' }}</label>
          <input type="password" v-model="password" required placeholder="请输入密码" />
        </div>
        <button type="submit">{{ $t('login') || 'Login' }}</button>
      </form>
      <p>
        <router-link to="/register">{{ $t('register') || 'Register' }}</router-link>
      </p>
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
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #87ceeb 50%, #87ceeb 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container > div {
  background: rgba(255, 255, 255, 0.95);
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(135, 206, 235, 0.3);
  border: 2px solid rgba(135, 206, 235, 0.2);
}

.login-container h2 {
  text-align: center;
  color: #2c5282;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-shadow: 1px 1px 2px rgba(135, 206, 235, 0.3);
}

.login-container label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.login-container input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 12px 16px;
  border-radius: 25px;
  border: 2px solid rgba(135, 206, 235, 0.3);
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-container input:focus {
  outline: none;
  border-color: #87ceeb;
  box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.2);
}

.login-container button {
  width: 100%;
  background: linear-gradient(135deg, #87ceeb, #4a90e2);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(135, 206, 235, 0.4);
  margin-bottom: 1rem;
}

.login-container button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(135, 206, 235, 0.6);
}

.login-container p {
  text-align: center;
  color: #4a5568;
}

.login-container a {
  color: #2c5282;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-container a:hover {
  color: #87ceeb;
}
</style>
