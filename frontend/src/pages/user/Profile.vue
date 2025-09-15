<template>
  <div class="profile-container">
    <h2>{{ t('profile') }}</h2>

    <div class="user-info">
      <div class="avatar-section">
        <div class="avatar">👤</div>
        <div class="user-details">
          <h3>{{ user.nickname || '用户' }}</h3>
          <p class="user-id">ID: {{ user.id }}</p>
        </div>
      </div>
      
      <div class="balance-section">
        <div class="balance-item">
          <span class="label">{{ t('balance') }}</span>
          <span class="value">¥{{ (user.balance || 0).toFixed(2) }}</span>
        </div>
        <div class="balance-item">
          <span class="label">VIP状态</span>
          <span class="value" :class="{ vip: user.isVip }">
            {{ user.isVip ? 'VIP会员' : '普通用户' }}
          </span>
        </div>
      </div>

      <div class="quick-actions">
        <button @click="goToWallet" class="action-btn wallet-btn">
          💰 {{ t('wallet') }}
        </button>
        <button @click="goToInvite" class="action-btn invite-btn">
          👥 {{ t('invite') }}
        </button>
        <button v-if="!user.isVip" @click="goToVip" class="action-btn vip-btn">
          👑 升级VIP
        </button>
      </div>
    </div>

    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab">{{ t(tab) }}</button>
    </div>

    <div v-if="currentTab === 'finance'" class="tab-content">
      <h3>{{ t('financeRecords') }}</h3>
      <ul>
        <li v-for="record in financeRecords" :key="record.id">{{ record.date }} - {{ record.type }} - {{ record.amount }} USDT</li>
      </ul>
    </div>

    <div v-if="currentTab === 'groups'" class="tab-content">
      <h3>{{ t('joinedGroups') }}</h3>
      <ul>
        <li v-for="group in groups" :key="group.id">{{ group.name }} - {{ group.status }} - {{ group.time }}</li>
      </ul>
    </div>

    <div v-if="currentTab === 'prizes'" class="tab-content">
      <h3>{{ t('prizes') }}</h3>
      <ul>
        <li v-for="prize in prizes" :key="prize.id">{{ prize.name }} - {{ prize.status }}</li>
      </ul>
    </div>

    <div v-if="currentTab === 'wallet'" class="tab-content">
      <h3>{{ t('wallet') }}</h3>
      <p>{{ t('currentBalance') }}：{{ user.balance }} USDT</p>
      <button @click="withdraw">{{ t('withdraw') }}</button>
      <button @click="recharge">{{ t('recharge') }}</button>
      <button @click="vipAction">{{ t('recommend') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getProfile } from '../../api/index.js'

const { t, locale } = useI18n()
const router = useRouter()

const user = ref({ nickname: '', inviteCode: '', inviteCount: 0, teamCount: 0, balance: 0, isVip: false })

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken')
  if (!isLogin) {
    router.push('/login')
    return
  }
  try {
    const res = await getProfile()
    Object.assign(user.value, res.data || {})
  } catch (e) {
    // ignore
  }
})

const tabs = ['finance', 'groups', 'prizes', 'wallet']
const currentTab = ref(tabs[0])

const financeRecords = ref([
  { id: 1, date: '2025-08-01', type: '充值', amount: 100 },
  { id: 2, date: '2025-08-02', type: '提现', amount: -50 },
  { id: 3, date: '2025-08-03', type: '分红', amount: 20 },
])

const groups = ref([
  { id: 1, name: '9.9区', status: '未中奖', time: '2025-08-01 12:00' },
  { id: 2, name: '98USDT区', status: '已中奖', time: '2025-08-02 14:00' },
])

const prizes = ref([
  { id: 1, name: '小米手机', status: '可领取' },
  { id: 2, name: '现金红包', status: '已回收' },
])

function withdraw() { router.push('/wallet') }
function recharge() { router.push('/wallet') }
function goToVip() { router.push('/vip') }
function goToWallet() { router.push('/wallet') }
function goToInvite() { router.push('/invite') }

function vipAction() {
  if (!user.value.isVip) {
    const missText = {
      zh: '很遗憾，你错过了XXX的分红XX',
      en: 'Sorry, you missed the dividend from XXX',
      es: 'Lo siento, perdiste el dividendo de XXX'
    }
    alert(window.vipMissContent || missText[locale.value] || missText.zh)
    return
  }
  alert(t('vipFeatureComing'))
}
</script>

<style scoped>
.profile-container { 
  max-width: 600px; 
  margin: 2rem auto; 
  padding: 2rem; 
  border: 1px solid #eee; 
  border-radius: 8px; 
  background: #fff;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-info {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.user-details h3 {
  margin: 0;
  color: #333;
}

.user-id {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #999;
}

.balance-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.balance-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.balance-item .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.balance-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.balance-item .value.vip {
  color: #FFD700;
}

.quick-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.wallet-btn {
  background: #4CAF50;
  color: white;
}

.invite-btn {
  background: #2196F3;
  color: white;
}

.vip-btn {
  background: #FFD700;
  color: #333;
}

.tabs { 
  display: flex; 
  gap: 1rem; 
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
}

.tabs button { 
  padding: 0.5rem 1rem; 
  border: none; 
  border-radius: 6px; 
  background: #eee; 
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.tabs button.active { 
  background: #667eea; 
  color: #fff;
}

.tab-content { 
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
}
</style>
