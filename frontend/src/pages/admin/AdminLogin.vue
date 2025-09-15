<template>
  <div class="gradient-container gradient-fade-in">
    <div class="gradient-card">
      <h2 class="gradient-title">
        <span class="admin-icon">🔐</span>
        {{ t('admin') || '管理员' }}
      </h2>
      <p class="gradient-subtitle">{{ t('adminLogin') || '管理员后台登录' }}</p>
      
      <form @submit.prevent="handleAdminLogin" class="gradient-form">
        <div class="gradient-field">
          <label class="gradient-label">{{ t('adminAccount') || '管理员账号' }}</label>
          <input 
            v-model="adminForm.account" 
            class="gradient-input"
            required 
            :placeholder="t('adminAccount') || '请输入管理员账号'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('adminPassword') || '管理员密码' }}</label>
          <input 
            type="password" 
            v-model="adminForm.password" 
            class="gradient-input"
            required 
            :placeholder="t('adminPassword') || '请输入管理员密码'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('adminLevel') || '权限级别' }}</label>
          <select v-model="adminForm.level" class="gradient-input">
            <option value="0">{{ t('superAdmin') || '超级管理员' }}</option>
            <option value="1">{{ t('normalAdmin') || '普通管理员' }}</option>
            <option value="2">{{ t('viewAdmin') || '查看权限' }}</option>
          </select>
        </div>
        
        <div class="security-notice">
          <div class="gradient-alert gradient-alert-info">
            <strong>{{ t('securityNotice') || '安全提醒' }}:</strong><br>
            {{ t('adminSecurityText') || '管理员登录将被记录，请确保在安全环境下操作' }}
          </div>
        </div>
        
        <button type="submit" class="gradient-button gradient-button-full" :disabled="isLoading">
          <span v-if="isLoading">{{ t('logging') || '登录中...' }}</span>
          <span v-else>{{ t('adminLogin') || '管理员登录' }}</span>
        </button>
      </form>
      
      <!-- Quick Links -->
      <div class="quick-links text-center mt-3">
        <router-link to="/language-select" class="gradient-link">
          {{ t('switchLang') || '切换语言' }}
        </router-link>
        <span class="mx-2">|</span>
        <router-link to="/login-register" class="gradient-link">
          {{ t('userLogin') || '用户登录' }}
        </router-link>
      </div>
      
      <!-- Alert Message -->
      <div v-if="alertMessage" class="gradient-alert" :class="alertType">
        {{ alertMessage }}
      </div>
      
      <!-- Admin Features Preview -->
      <div class="admin-features mt-4">
        <h4 class="gradient-text text-center mb-2">{{ t('adminFeatures') || '管理功能' }}</h4>
        <div class="feature-grid">
          <div class="feature-item">
            <span class="feature-icon">🎁</span>
            <span class="feature-text">{{ t('prizeManagement') || '奖品管理' }}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <span class="feature-text">{{ t('messageManagement') || '消息管理' }}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👥</span>
            <span class="feature-text">{{ t('userManagement') || '用户管理' }}</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span class="feature-text">{{ t('dataAnalysis') || '数据分析' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('')

// Initialize i18n but with fallback
let t = (key) => {
  const translations = {
    admin: '管理员',
    adminLogin: '管理员登录',
    adminAccount: '管理员账号',
    adminPassword: '管理员密码',
    adminLevel: '权限级别',
    superAdmin: '超级管理员',
    normalAdmin: '普通管理员',
    viewAdmin: '查看权限',
    securityNotice: '安全提醒',
    adminSecurityText: '管理员登录将被记录，请确保在安全环境下操作',
    logging: '登录中...',
    switchLang: '切换语言',
    userLogin: '用户登录',
    adminFeatures: '管理功能',
    prizeManagement: '奖品管理',
    messageManagement: '消息管理',
    userManagement: '用户管理',
    dataAnalysis: '数据分析',
    pleaseComplete: '请完善登录信息',
    adminLoginSuccess: '管理员登录成功！',
    adminLoginFailed: '管理员账号或密码错误',
    adminLoginError: '登录出现错误，请稍后重试'
  }
  return translations[key] || key
}

try {
  const { t: i18nT } = useI18n()
  t = i18nT
} catch (e) {
  console.warn('i18n not available, using fallback')
}

const adminForm = reactive({
  account: '',
  password: '',
  level: '0'
})

function showAlert(message, type = 'gradient-alert-info') {
  alertMessage.value = message
  alertType.value = type
  setTimeout(() => {
    clearAlert()
  }, 4000)
}

function clearAlert() {
  alertMessage.value = ''
  alertType.value = ''
}

async function handleAdminLogin() {
  try {
    // Validate form
    if (!adminForm.account || !adminForm.password) {
      showAlert(t('pleaseComplete') || '请完善登录信息', 'gradient-alert-error')
      return
    }
    
    isLoading.value = true
    
    // TODO: Replace with actual admin API call
    // For now, simulate admin login with basic validation
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
    
    // Basic demo validation
    if (adminForm.account === 'admin' && adminForm.password === 'admin123') {
      // Store admin session
      localStorage.setItem('adminToken', 'admin-token-' + Date.now())
      localStorage.setItem('adminLevel', adminForm.level)
      localStorage.setItem('adminName', adminForm.account)
      
      showAlert(t('adminLoginSuccess') || '管理员登录成功！', 'gradient-alert-success')
      
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } else {
      showAlert(t('adminLoginFailed') || '管理员账号或密码错误', 'gradient-alert-error')
    }
    
  } catch (error) {
    showAlert(t('adminLoginError') || '登录出现错误，请稍后重试', 'gradient-alert-error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-icon {
  font-size: 1.2em;
  margin-right: 0.5rem;
}

.mx-2 {
  margin: 0 0.5rem;
  color: var(--text-light);
}

.quick-links {
  padding-top: 1rem;
  border-top: 1px solid rgba(135, 206, 235, 0.2);
}

.security-notice {
  margin: 1.5rem 0;
}

.admin-features {
  border-top: 1px solid rgba(135, 206, 235, 0.2);
  padding-top: 1.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  border: 1px solid rgba(135, 206, 235, 0.2);
  transition: var(--transition-smooth);
}

.feature-item:hover {
  background: rgba(135, 206, 235, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.2em;
  margin-right: 0.5rem;
}

.feature-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Select styling */
select.gradient-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  cursor: pointer;
}

/* Loading state */
.gradient-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.gradient-button:disabled:hover {
  transform: none;
  box-shadow: var(--shadow-button);
}

/* Animation for form fields */
.gradient-field:nth-child(1) { animation-delay: 0.1s; }
.gradient-field:nth-child(2) { animation-delay: 0.2s; }
.gradient-field:nth-child(3) { animation-delay: 0.3s; }

.gradient-field {
  animation: gradient-slide-in 0.6s ease-out both;
}

.security-notice {
  animation: gradient-fade-in 0.8s ease-out 0.4s both;
}

.admin-features {
  animation: gradient-fade-in 1s ease-out 0.6s both;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-item {
    padding: 0.6rem;
  }
  
  .feature-text {
    font-size: 0.8rem;
  }
}
</style>