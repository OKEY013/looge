<template>
  <div class="vip-container">
    <h2>{{ t('vipPurchase') }}</h2>

    <div class="vip-info">
      <p>{{ t('vipBenefitsTitle') }}</p>
      <ul>
        <li>{{ t('vipBenefit.rebate') }}</li>
        <li>{{ t('vipBenefit.teamBonus') }}</li>
        <li>{{ t('vipBenefit.exclusiveEvents') }}</li>
      </ul>
      <p>{{ t('vipPrice') }}：<span class="vip-price">98 USDT/年</span></p>
    </div>

    <button class="buy-btn" @click="buyVip">{{ t('buyVip') }}</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

function buyVip() {
  // 模拟购买逻辑：标记本地状态并跳回个人中心
  window.localStorage.setItem('isVip', 'true')
  alert(t('vipPurchaseSuccess'))
  router.push('/profile')
}
</script>

<style scoped>
.vip-container { 
  max-width: 600px; 
  margin: 2rem auto; 
  padding: 2rem; 
  background: #fff; 
  border: 1px solid #eee; 
  border-radius: 8px; 
}
.vip-info p { margin: 0 0 0.5rem }
.vip-info ul { padding-left: 1.2rem; margin: 0 0 1rem }
.vip-price { color: #e91e63; font-weight: bold }
.buy-btn { background: #ff9800; color: #fff; padding: 0.6rem 1rem; border: none; border-radius: 4px; cursor: pointer }
.buy-btn:hover { opacity: 0.95 }
</style>
