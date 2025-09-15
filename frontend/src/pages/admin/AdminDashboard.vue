<template>
  <div class="gradient-container gradient-fade-in">
    <div class="gradient-card gradient-card-xl">
      <h2 class="gradient-title">{{ t('admin') }}</h2>

      <div class="gradient-tabs">
        <button v-for="tab in tabs" :key="tab" :class="{ active: currentTab === tab }" @click="currentTab = tab" class="gradient-tab">{{ t(tab) }}</button>
      </div>

      <div v-if="currentTab === 'prizeSettings'" class="tab-content">
        <h3 class="gradient-subtitle">{{ t('prizeSettings') }}</h3>
        <p v-if="adminLevel !== 0" class="gradient-alert gradient-alert-error">{{ t('noPermission') }}</p>
        <div v-else>
          <ul class="gradient-list">
            <li v-for="prize in prizes" :key="prize.id" class="gradient-list-item">
              {{ prize.name }} - {{ prize.value }}
              <div class="action-buttons" style="margin-top: 0.5rem;">
                <button @click="editPrize(prize)" class="gradient-button" style="margin-right: 0.5rem;">{{ t('edit') }}</button>
                <button @click="deletePrize(prize.id)" class="gradient-button gradient-button-secondary">{{ t('delete') }}</button>
              </div>
            </li>
          </ul>
          <button @click="addPrize" class="gradient-button mt-3">{{ t('addPrize') }}</button>
        </div>
      </div>

      <div v-if="currentTab === 'popupSettings'" class="tab-content">
        <h3 class="gradient-subtitle">{{ t('popupSettings') }}</h3>
        <div class="gradient-field">
          <label class="gradient-label">{{ t('nonVipPopup') }}</label>
          <textarea v-model="vipPopupContent" rows="2" class="gradient-textarea"></textarea>
        </div>
        <div class="gradient-field">
          <label class="gradient-label">{{ t('missBonusPopup') }}</label>
          <textarea v-model="vipMissContent" rows="2" class="gradient-textarea"></textarea>
        </div>
        <div class="action-buttons">
          <button @click="savePopupContent" class="gradient-button">{{ t('save') }}</button>
          <button @click="sendToAllUsers" class="gradient-button" style="margin-left:1rem;">{{ t('sendAll') }}</button>
        </div>
      </div>
      
      <div class="quick-links text-center mt-4">
        <router-link to="/language-select" class="gradient-link">{{ t('switchLang') || '切换语言' }}</router-link>
        <span class="mx-2">|</span>
        <router-link to="/login-register" class="gradient-link">{{ t('userLogin') || '用户登录' }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const adminLevel = ref(0)

// Initialize fallback translations
const t = (key) => {
  const translations = {
    admin: '管理员',
    prizeSettings: '奖品设置',
    popupSettings: '弹窗设置',
    noPermission: '没有权限',
    edit: '编辑',
    delete: '删除',
    addPrize: '添加奖品',
    nonVipPopup: '非VIP弹窗',
    missBonusPopup: '错过分红弹窗',
    save: '保存',
    sendAll: '发送给所有用户',
    switchLang: '切换语言',
    userLogin: '用户登录',
    saved: '已保存',
    sentToAll: '已发送给所有用户',
    vip: 'VIP'
  }
  return translations[key] || key
}

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
.tab-content { 
  margin-top: 2rem; 
  animation: gradient-fade-in 0.5s ease-out;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.mx-2 {
  margin: 0 0.5rem;
  color: var(--text-light);
}

.quick-links {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(135, 206, 235, 0.2);
}

.mt-3 {
  margin-top: 1.5rem;
}

.mt-4 {
  margin-top: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    margin-left: 0 !important;
    margin-bottom: 0.5rem;
  }
}
</style>
