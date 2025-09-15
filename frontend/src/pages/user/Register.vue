<template>
  <div class="gradient-container gradient-fade-in">
    <div class="gradient-card gradient-card-large">
      <h2 class="gradient-title">{{ t('register') }}</h2>
      <form @submit.prevent="onRegister" class="gradient-form">
        <div class="gradient-field">
          <label class="gradient-label">{{ t('account') }}</label>
          <input v-model="account" name="account" required :placeholder="t('enterAccount')" class="gradient-input" />
        </div>

        <div class="gradient-field">
          <label class="gradient-label">{{ t('password') }}</label>
          <input type="password" v-model="password" name="password" required :placeholder="t('enterPassword')" class="gradient-input" />
        </div>

        <div class="gradient-field">
          <label class="gradient-label">{{ t('confirmPassword') }}</label>
          <input type="password" v-model="confirmPassword" name="confirmPassword" required :placeholder="t('enterConfirmPassword')" class="gradient-input" />
        </div>

        <div class="gradient-field">
          <label class="gradient-label">{{ t('inviteCode') }}</label>
          <input v-model="inviteCode" name="inviteCode" maxlength="6" minlength="6" :placeholder="t('enterInvite')" class="gradient-input" />
        </div>

        <button type="submit" class="gradient-button gradient-button-full">{{ t('register') }}</button>
      </form>

      <div class="quick-links text-center mt-3">
        <router-link to="/login" class="gradient-link">{{ t('login') }}</router-link>
        <span class="mx-2">|</span>
        <router-link to="/language-select" class="gradient-link">{{ t('switchLang') || '切换语言' }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Initialize fallback translations
const t = (key) => {
  const translations = {
    register: '注册',
    account: '账号',
    password: '密码',
    confirmPassword: '确认密码',
    inviteCode: '邀请码',
    login: '登录',
    switchLang: '切换语言',
    enterAccount: '请输入账号',
    enterPassword: '请输入密码',
    enterConfirmPassword: '请输入确认密码',
    enterInvite: '请输入邀请码',
    passwordMismatch: '密码不一致',
    inviteCodeInvalid: '邀请码格式错误',
    registerSuccess: '注册成功'
  }
  return translations[key] || key
}

const account = ref('')
const password = ref('')
const confirmPassword = ref('')
const inviteCode = ref('')

function onRegister() {
  if (password.value !== confirmPassword.value) {
    alert(t('passwordMismatch'))
    return
  }
  if (inviteCode.value && !/^\d{6}$/.test(inviteCode.value)) {
    alert(t('inviteCodeInvalid'))
    return
  }
  // TODO: 调用后端注册 API
  alert(t('registerSuccess'))
  router.push('/login')
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

/* Form field slide-in animation */
.gradient-field:nth-child(1) { animation-delay: 0.1s; }
.gradient-field:nth-child(2) { animation-delay: 0.2s; }
.gradient-field:nth-child(3) { animation-delay: 0.3s; }
.gradient-field:nth-child(4) { animation-delay: 0.4s; }

.gradient-field {
  animation: gradient-slide-in 0.6s ease-out both;
}
</style>
