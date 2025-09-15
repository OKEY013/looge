<template>
  <div class="home-container">
    <!-- Language Switcher -->
    <div class="language-switcher">
      <select v-model="currentLang" @change="changeLanguage">
        <option value="zh">中文</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>

    <!-- Header -->
    <div class="header">
      <h1>Looge</h1>
      <p class="subtitle">欢迎来到Looge幸运团购</p>
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <div class="feature-grid">
        <div class="feature-card" @click="goToGroup">
          <div class="card-icon">🎯</div>
          <h3>团购抽奖</h3>
          <p>参与团购，赢取大奖</p>
        </div>
        
        <div class="feature-card" @click="goToShare">
          <div class="card-icon">💰</div>
          <h3>分享赚钱</h3>
          <p>分享给朋友，获得收益</p>
        </div>
        
        <div class="feature-card" @click="goToVip">
          <div class="card-icon">👑</div>
          <h3>VIP特权</h3>
          <p>升级VIP，享受更多特权</p>
        </div>
        
        <div class="feature-card" @click="goToProfile">
          <div class="card-icon">👤</div>
          <h3>个人中心</h3>
          <p>管理您的账户信息</p>
        </div>
      </div>
    </div>
    
    <!-- Auth Buttons -->
    <div class="auth-buttons">
      <button @click="goToLogin" class="btn login-btn">登录</button>
      <button @click="goToRegister" class="btn register-btn">注册</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentLang = ref('zh')

const changeLanguage = () => {
  // Simple language switching for now
  localStorage.setItem('language', currentLang.value)
  window.location.reload()
}

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
  background: linear-gradient(135deg, #ffffff 0%, #87ceeb 50%, #87ceeb 100%);
  color: #333;
  text-align: center;
  position: relative;
}

.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
}

.language-switcher select {
  padding: 8px 12px;
  border: 2px solid #87ceeb;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 500;
  cursor: pointer;
}

.language-switcher select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(135, 206, 235, 0.3);
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(135, 206, 235, 0.3);
  color: #2c5282;
  margin-top: 2rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  color: #4a5568;
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
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(135, 206, 235, 0.3);
  box-shadow: 0 5px 15px rgba(135, 206, 235, 0.2);
}

.feature-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 15px 30px rgba(135, 206, 235, 0.4);
  border-color: #87ceeb;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin-bottom: 10px;
  font-size: 1.3rem;
  color: #2c5282;
}

.feature-card p {
  opacity: 0.7;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
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
  font-weight: 600;
}

.login-btn {
  background: linear-gradient(135deg, #87ceeb, #4a90e2);
  color: white;
  box-shadow: 0 4px 15px rgba(135, 206, 235, 0.4);
}

.register-btn {
  background: transparent;
  color: #2c5282;
  border: 2px solid #87ceeb;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(135, 206, 235, 0.5);
}

.register-btn:hover {
  background: rgba(135, 206, 235, 0.1);
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .header h1 {
    font-size: 2.5rem;
  }

  .language-switcher {
    position: static;
    margin-bottom: 20px;
  }

  .home-container {
    padding: 15px;
  }
}
</style>
