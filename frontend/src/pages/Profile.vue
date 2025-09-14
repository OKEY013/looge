<template>
  <div class="profile-container">
    <h2>{{ t('profile') }}</h2>

    <div class="user-info">
      <p>{{ t('nickname') }}：{{ user.nickname }}</p>
      <p>{{ t('inviteCode') }}：{{ user.inviteCode }}</p>
      <p>{{ t('inviteCount') }}：{{ user.inviteCount }}</p>
      <p>{{ t('teamCount') }}：{{ user.teamCount }}</p>
      <p>{{ t('balance') }}：{{ user.balance }} USDT</p>
      <p>
        {{ t('vip') }}{{ t('status') }}：
        <span :style="{ color: user.isVip ? 'green' : 'red' }">
          {{ user.isVip ? t('vipMember') : t('normalUser') }}
        </span>
        <button v-if="!user.isVip" @click="goToVip" class="vip-btn">{{ t('buyVip') }}</button>
      </p>
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
import { getProfile } from '../api/index.js'

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

function withdraw() { alert(t('withdrawComing')) }
function recharge() { alert(t('rechargeComing')) }
function goToVip() { router.push('/vip') }

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
.profile-container { max-width: 600px; margin: 2rem auto; padding: 2rem; border: 1px solid #eee; border-radius: 8px; background: #fff }
.user-info p { margin: 0.5rem 0 }
.tabs { display:flex; gap:1rem; margin:1rem 0 }
.tabs button { padding:0.5rem 1rem; border:none; border-radius:4px; background:#eee; cursor:pointer }
.tabs button.active { background:#2196f3; color:#fff }
.tab-content { margin-top:1rem }
.vip-btn { margin-left: 1rem; padding: 0.3rem 1rem; background: gold; color: #333; border: none; border-radius: 4px; cursor: pointer; font-weight: bold }
.vip-btn:hover { background: orange }
</style>
