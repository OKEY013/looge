<template>
  <div class="gradient-container gradient-fade-in">
    <div class="gradient-card gradient-card-large">
      <h1 class="gradient-title">欢迎来到Looge幸运团购</h1>
      <p class="gradient-subtitle">请选择语言 / Please select language</p>
      
      <div class="gradient-lang-grid">
        <div 
          v-for="lang in languages" 
          :key="lang.code"
          class="gradient-lang-option gradient-slide-in"
          :class="{ selected: selectedLanguage === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          <div class="lang-flag">{{ lang.flag }}</div>
          <div class="lang-name">{{ lang.name }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button 
          class="gradient-button gradient-button-full"
          @click="confirmLanguage"
          :disabled="!selectedLanguage"
        >
          确认 / Confirm
        </button>
        
        <div class="quick-links text-center mt-3">
          <router-link to="/login-register" class="gradient-link">
            登录 / 注册
          </router-link>
          <span class="mx-2">|</span>
          <router-link to="/admin-login" class="gradient-link">
            管理员登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const selectedLanguage = ref('')

// Initialize i18n but with fallback
let locale = ref('zh')
try {
  const { locale: i18nLocale } = useI18n()
  locale = i18nLocale
} catch (e) {
  console.warn('i18n not available, using fallback')
}

const languages = [
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸'
  }
]

onMounted(() => {
  // Get saved language or current locale
  selectedLanguage.value = localStorage.getItem('language') || locale.value || 'zh'
})

function selectLanguage(langCode) {
  selectedLanguage.value = langCode
}

function confirmLanguage() {
  if (selectedLanguage.value) {
    // Save language preference
    localStorage.setItem('language', selectedLanguage.value)
    
    // Update i18n locale if available
    try {
      locale.value = selectedLanguage.value
    } catch (e) {
      console.warn('Could not update locale')
    }
    
    // Navigate to login/register page
    router.push('/login-register')
  }
}
</script>

<style scoped>
.lang-flag {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.lang-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.action-buttons {
  margin-top: 2rem;
}

.mx-2 {
  margin: 0 0.5rem;
  color: var(--text-light);
}

.gradient-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.gradient-button:disabled:hover {
  transform: none;
  box-shadow: var(--shadow-button);
}

/* Animation delays for language options */
.gradient-lang-option:nth-child(1) {
  animation-delay: 0.1s;
}

.gradient-lang-option:nth-child(2) {
  animation-delay: 0.2s;
}

.gradient-lang-option:nth-child(3) {
  animation-delay: 0.3s;
}
</style>