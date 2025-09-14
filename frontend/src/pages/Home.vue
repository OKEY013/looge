<template>
  <div class="home-container">
    <div class="header">
      <h1>Looge</h1>
      <p class="subtitle">欢迎来到Looge抽奖团购平台</p>
    </div>
    
    <div class="main-content">
      <div class="feature-grid">
        <div class="feature-card" @click="goToGroup">
          <h3>团购抽奖</h3>
          <p>参与团购，赢取大奖</p>
        </div>
        
        <div class="feature-card" @click="goToShare">
          <h3>分享赚钱</h3>
          <p>分享给朋友，获得收益</p>
        </div>
        
        <div class="feature-card" @click="goToVip">
          <h3>VIP特权</h3>
          <p>升级VIP，享受更多特权</p>
        </div>
        
        <div class="feature-card" @click="goToProfile">
          <h3>个人中心</h3>
          <p>管理您的账户信息</p>
        </div>
      </div>
    </div>
    
    <div class="auth-buttons">
      <button @click="goToLogin" class="btn login-btn">登录</button>
      <button @click="goToRegister" class="btn register-btn">注册</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToGroup = () => router.push('/group')
const goToShare = () => router.push('/share')
const goToVip = () => router.push('/vip')
const goToProfile = () => router.push('/profile')
const goToLogin = () => router.push('/login')
const goToRegister = () => router.push('/register')
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #87ceeb 100%);
  color: #2c3e50;
  text-align: center;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.main-content {
  max-width: 600px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 2rem 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.feature-card h3 {
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.feature-card p {
  opacity: 0.8;
  font-size: 0.9rem;
}

.auth-buttons {
  margin-top: 3rem;
}

.btn {
  padding: 12px 30px;
  margin: 0 10px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn {
  background: #87ceeb;
  color: #2c3e50;
}

.register-btn {
  background: transparent;
  color: #2c3e50;
  border: 2px solid #87ceeb;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 2.5rem;
  }
}
</style>
