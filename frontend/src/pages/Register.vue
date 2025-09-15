<template>
  <div class="register-container">
    <h2>{{ t('register') }}</h2>
    <form @submit.prevent="onRegister">
      <div class="field">
        <label>{{ t('account') }}</label>
        <input v-model="account" name="account" required :placeholder="t('enterAccount')" />
      </div>

      <div class="field">
        <label>{{ t('password') }}</label>
        <input type="password" v-model="password" name="password" required :placeholder="t('enterPassword')" />
      </div>

      <div class="field">
        <label>{{ t('confirmPassword') }}</label>
        <input type="password" v-model="confirmPassword" name="confirmPassword" required :placeholder="t('enterConfirmPassword')" />
      </div>

      <div class="field">
        <label>{{ t('inviteCode') }}</label>
        <input v-model="inviteCode" name="inviteCode" maxlength="6" minlength="6" :placeholder="t('enterInvite')" />
      </div>

      <button type="submit">{{ t('register') }}</button>
    </form>

    <p class="goto-login">
      <router-link to="/login">{{ t('login') }}</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

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
.register-container { max-width:480px; margin:2rem auto; padding:1rem; background:#fff; border-radius:8px }
.field { margin-bottom:0.8rem }
.field label { display:block; margin-bottom:0.3rem }
input { width:100%; padding:0.5rem; border:1px solid #ddd; border-radius:4px }
button { margin-top:0.6rem; padding:0.6rem 1rem; background:#2196f3;color:#fff;border:none;border-radius:4px }
.goto-login { margin-top:1rem; text-align:center }
</style>
