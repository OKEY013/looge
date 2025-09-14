<template>
  <div class="admin-container">
    <h2>{{ t('admin') }}</h2>

    <div class="tabs">
      <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab">{{ t(tab) }}</button>
    </div>

    <div v-if="currentTab === 'prizeSettings'" class="tab-content">
      <h3>{{ t('prizeSettings') }}</h3>
      <p v-if="adminLevel !== 0">{{ t('noPermission') }}</p>
      <div v-else>
        <ul>
          <li v-for="prize in prizes" :key="prize.id">
            {{ prize.name }} - {{ prize.value }}
            <button @click="editPrize(prize)">{{ t('edit') }}</button>
            <button @click="deletePrize(prize.id)">{{ t('delete') }}</button>
          </li>
        </ul>
        <button @click="addPrize">{{ t('addPrize') }}</button>
      </div>
    </div>

    <div v-if="currentTab === 'popupSettings'" class="tab-content">
      <h3>{{ t('popupSettings') }}</h3>
      <label>{{ t('nonVipPopup') }}</label>
      <textarea v-model="vipPopupContent" rows="2" style="width:100%"></textarea>
      <br>
      <label>{{ t('missBonusPopup') }}</label>
      <textarea v-model="vipMissContent" rows="2" style="width:100%"></textarea>
      <br>
      <button @click="savePopupContent">{{ t('save') }}</button>
      <button @click="sendToAllUsers" style="margin-left:1rem;background:#2196f3;color:#fff;">{{ t('sendAll') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const adminLevel = ref(0)
const tabs = ['prizeSettings', 'popupSettings']
const currentTab = ref(tabs[0])

const prizes = ref([
  { id: 1, name: '98USDT大奖', value: '98 USDT' }
])

const vipPopupContent = ref(window.vipPopupContent || `只有${t('vip')}会员才能获得更多特权`)
const vipMissContent = ref(window.vipMissContent || '很遗憾，你错过了本次分红')

function addPrize() { alert(t('addPrize')) }
function editPrize(p) { alert(t('edit') + p.name) }
function deletePrize(id) { alert(t('delete') + id) }

function savePopupContent() {
  window.vipPopupContent = vipPopupContent.value
  window.vipMissContent = vipMissContent.value
  alert(t('saved'))
}

function sendToAllUsers() {
  alert(t('sentToAll'))
}
</script>

<style scoped>
.admin-container { max-width: 900px; margin: 2rem auto; padding: 1rem; border: 1px solid #eee; border-radius: 8px; background: #fff }
.tabs { display:flex; gap:0.5rem; margin-bottom:1rem }
.tabs button { padding:0.4rem 0.8rem; border:none; background:#eee; cursor:pointer }
.tabs button.active { background:#2196f3; color:#fff }
.tab-content { margin-top:1rem }
textarea { min-height:60px }
</style>
