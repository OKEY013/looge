<template>
  <div class="gradient-container gradient-fade-in">
    <div class="gradient-card gradient-card-large">
      <h2 class="gradient-title">
        {{ isLoginMode ? t('login') : t('register') }}
      </h2>
      
      <!-- Toggle Tabs -->
      <div class="gradient-tabs">
        <button 
          class="gradient-tab"
          :class="{ active: isLoginMode }"
          @click="setMode(true)"
        >
          {{ t('login') }}
        </button>
        <button 
          class="gradient-tab"
          :class="{ active: !isLoginMode }"
          @click="setMode(false)"
        >
          {{ t('register') }}
        </button>
      </div>
      
      <!-- Login Form -->
      <form v-if="isLoginMode" @submit.prevent="handleLogin" class="gradient-form">
        <div class="gradient-field">
          <label class="gradient-label">{{ t('account') }}</label>
          <input 
            v-model="loginForm.account" 
            class="gradient-input"
            required 
            :placeholder="t('account') || '请输入账号'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('password') }}</label>
          <input 
            type="password" 
            v-model="loginForm.password" 
            class="gradient-input"
            required 
            :placeholder="t('password') || '请输入密码'" 
          />
        </div>
        
        <button type="submit" class="gradient-button gradient-button-full">
          {{ t('login') }}
        </button>
      </form>
      
      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="gradient-form">
        <div class="gradient-field">
          <label class="gradient-label">{{ t('account') }}</label>
          <input 
            v-model="registerForm.account" 
            class="gradient-input"
            required 
            :placeholder="t('account') || '请输入账号'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('password') }}</label>
          <input 
            type="password" 
            v-model="registerForm.password" 
            class="gradient-input"
            required 
            :placeholder="t('password') || '请输入密码'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('confirmPassword') }}</label>
          <input 
            type="password" 
            v-model="registerForm.confirmPassword" 
            class="gradient-input"
            required 
            :placeholder="t('confirmPassword') || '确认密码'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('nickname') || '昵称' }}</label>
          <input 
            v-model="registerForm.nickname" 
            class="gradient-input"
            :placeholder="t('nickname') || '请输入昵称'" 
          />
        </div>
        
        <div class="gradient-field">
          <label class="gradient-label">{{ t('inviteCode') }}</label>
          <input 
            v-model="registerForm.inviteCode" 
            class="gradient-input"
            maxlength="6" 
            minlength="6" 
            :placeholder="t('inviteCode') || '邀请码（可选）'" 
          />
        </div>
        
        <button type="submit" class="gradient-button gradient-button-full">
          {{ t('register') }}
        </button>
      </form>
      
      <!-- Quick Links -->
      <div class="quick-links text-center mt-3">
        <router-link to="/language-select" class="gradient-link">
          {{ t('switchLang') || '切换语言' }}
        </router-link>
        <span class="mx-2">|</span>
        <router-link to="/admin-login" class="gradient-link">
          {{ t('admin') || '管理员登录' }}
        </router-link>
      </div>
      
      <!-- Alert Message -->
      <div v-if="alertMessage" class="gradient-alert" :class="alertType">
        {{ alertMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLoginMode = ref(true)
const alertMessage = ref('')
const alertType = ref('')

// Initialize i18n but with fallback
let t = (key) => {
  const translations = {
    login: '登录',
    register: '注册',
    account: '账号',
    password: '密码',
    confirmPassword: '确认密码',
    nickname: '昵称',
    inviteCode: '邀请码',
    switchLang: '切换语言',
    admin: '管理员登录',
    pleaseComplete: '请完善信息',
    loginSuccess: '登录成功！',
    loginFailed: '登录失败',
    registerSuccess: '注册成功！',
    registerFailed: '注册失败',
    passwordMismatch: '密码不一致',
    inviteCodeInvalid: '邀请码格式错误'
  }
  return translations[key] || key
}

try {
  const { t: i18nT } = useI18n()
  t = i18nT
} catch (e) {
  console.warn('i18n not available, using fallback')
}

const loginForm = reactive({
  account: '',
  password: ''
})

const registerForm = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  inviteCode: ''
})

onMounted(() => {
  // Check if we should start in register mode
  if (route.query.mode === 'register') {
    isLoginMode.value = false
  }
})

function setMode(login) {
  isLoginMode.value = login
  clearAlert()
  clearForms()
}

function clearForms() {
  Object.assign(loginForm, { account: '', password: '' })
  Object.assign(registerForm, { 
    account: '', 
    password: '', 
    confirmPassword: '', 
    nickname: '', 
    inviteCode: '' 
  })
}

function showAlert(message, type = 'gradient-alert-info') {
  alertMessage.value = message
  alertType.value = type
  setTimeout(() => {
    clearAlert()
  }, 3000)
}

function clearAlert() {
  alertMessage.value = ''
  alertType.value = ''
}

async function handleLogin() {
  try {
    // Validate form
    if (!loginForm.account || !loginForm.password) {
      showAlert(t('pleaseComplete') || '请完善登录信息', 'gradient-alert-error')
      return
    }
    
    // TODO: Replace with actual API call
    // For now, simulate login
    localStorage.setItem('userToken', 'demo-token-' + Date.now())
    localStorage.setItem('userName', loginForm.account)
    
    showAlert(t('loginSuccess') || '登录成功！欢迎来到Looge幸运团购', 'gradient-alert-success')
    
    setTimeout(() => {
      router.push('/group')
    }, 1000)
    
  } catch (error) {
    showAlert(t('loginFailed') || '登录失败，请检查账号密码', 'gradient-alert-error')
  }
}

async function handleRegister() {
  try {
    // Validate form
    if (!registerForm.account || !registerForm.password || !registerForm.confirmPassword) {
      showAlert(t('pleaseComplete') || '请完善注册信息', 'gradient-alert-error')
      return
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      showAlert(t('passwordMismatch') || '密码不一致', 'gradient-alert-error')
      return
    }
    
    if (registerForm.inviteCode && !/^\d{6}$/.test(registerForm.inviteCode)) {
      showAlert(t('inviteCodeInvalid') || '邀请码格式错误（6位数字）', 'gradient-alert-error')
      return
    }
    
    // TODO: Replace with actual API call
    // For now, simulate registration
    showAlert(t('registerSuccess') || '注册成功！请登录', 'gradient-alert-success')
    
    setTimeout(() => {
      setMode(true) // Switch to login mode
      loginForm.account = registerForm.account
    }, 1000)
    
  } catch (error) {
    showAlert(t('registerFailed') || '注册失败，请稍后重试', 'gradient-alert-error')
  }
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

.gradient-alert {
  margin-top: 1rem;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

/* Tab transition effects */
.gradient-tab {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.gradient-form {
  animation: gradient-fade-in 0.5s ease-out;
}

/* Input focus animations */
.gradient-input:focus {
  transform: scale(1.02);
}

/* Form field slide-in animation */
.gradient-field:nth-child(1) { animation-delay: 0.1s; }
.gradient-field:nth-child(2) { animation-delay: 0.2s; }
.gradient-field:nth-child(3) { animation-delay: 0.3s; }
.gradient-field:nth-child(4) { animation-delay: 0.4s; }
.gradient-field:nth-child(5) { animation-delay: 0.5s; }

.gradient-field {
  animation: gradient-slide-in 0.6s ease-out both;
}
</style>