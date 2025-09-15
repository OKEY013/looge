<template>
  <div class="invite-container">
    <!-- Header -->
    <div class="header">
      <button @click="goBack" class="back-btn">← {{ $t('back') }}</button>
      <h2>{{ $t('invite') }}</h2>
    </div>

    <!-- My Invite Code -->
    <div class="invite-code-card">
      <h3>我的邀请码</h3>
      <div class="code-display">
        <span class="code">{{ myInviteCode || '生成中...' }}</span>
        <button @click="copyCode" class="copy-btn">复制</button>
      </div>
      <div class="code-actions">
        <button @click="generateQR" class="btn qr-btn">生成二维码</button>
        <button @click="shareInvite" class="btn share-btn">分享邀请</button>
      </div>
    </div>

    <!-- Invite Stats -->
    <div class="stats-card">
      <h3>邀请统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">{{ inviteStats.direct_invites || 0 }}</div>
          <div class="stat-label">直接邀请</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ inviteStats.indirect_invites || 0 }}</div>
          <div class="stat-label">间接邀请</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ inviteStats.third_level_invites || 0 }}</div>
          <div class="stat-label">三级邀请</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">¥{{ (inviteStats.total_commission || 0).toFixed(2) }}</div>
          <div class="stat-label">累计佣金</div>
        </div>
      </div>
    </div>

    <!-- Commission Levels -->
    <div class="commission-card">
      <h3>返利制度</h3>
      <div class="commission-levels">
        <div class="level-item">
          <span class="level">一级返利</span>
          <span class="rate">0.5%</span>
        </div>
        <div class="level-item">
          <span class="level">二级返利</span>
          <span class="rate">1.0%</span>
        </div>
        <div class="level-item">
          <span class="level">三级返利</span>
          <span class="rate">2.0%</span>
        </div>
      </div>
    </div>

    <!-- My Invites List -->
    <div class="invites-list-card">
      <h3>我的邀请人</h3>
      <div class="invites-list">
        <div 
          v-for="invite in myInvites" 
          :key="invite.id"
          class="invite-item"
        >
          <div class="invite-info">
            <div class="invite-name">{{ invite.nickname || '用户' + invite.id }}</div>
            <div class="invite-time">{{ formatDate(invite.created_at) }}</div>
          </div>
          <div class="invite-balance">
            ¥{{ (invite.balance || 0).toFixed(2) }}
          </div>
        </div>
        
        <div v-if="myInvites.length === 0" class="no-data">
          暂无邀请记录
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="load-more">
        <button @click="loadMoreInvites" :disabled="loading" class="btn load-more-btn">
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div v-if="showQRModal" class="modal-overlay" @click="showQRModal = false">
      <div class="modal-content qr-modal" @click.stop>
        <h3>邀请二维码</h3>
        <div class="qr-container">
          <canvas ref="qrCanvas" class="qr-code"></canvas>
        </div>
        <div class="qr-info">
          <p>扫描二维码注册并使用邀请码：</p>
          <p class="code">{{ myInviteCode }}</p>
        </div>
        <div class="modal-buttons">
          <button @click="downloadQR" class="btn download-btn">下载二维码</button>
          <button @click="showQRModal = false" class="btn close-btn">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../api/index.js'
import QRCode from 'qrcode'

const router = useRouter()
const { t } = useI18n()

// 响应式数据
const myInviteCode = ref('')
const inviteStats = ref({})
const myInvites = ref([])
const currentPage = ref(1)
const hasMore = ref(true)
const loading = ref(false)
const showQRModal = ref(false)

// DOM引用
const qrCanvas = ref(null)

// 生成邀请码
const generateInviteCode = async () => {
  try {
    const response = await api.get('/invite/generate')
    myInviteCode.value = response.data.invite_code
  } catch (error) {
    console.error('生成邀请码失败:', error)
  }
}

// 获取邀请统计
const fetchInviteStats = async () => {
  try {
    const response = await api.get('/invite/stats')
    inviteStats.value = response.data.data
  } catch (error) {
    console.error('获取邀请统计失败:', error)
  }
}

// 获取我的邀请人列表
const fetchMyInvites = async (isLoadMore = false) => {
  try {
    loading.value = true
    const page = isLoadMore ? currentPage.value + 1 : 1
    
    const response = await api.get('/invite/list', {
      params: { page, limit: 20 }
    })
    
    if (isLoadMore) {
      myInvites.value = [...myInvites.value, ...response.data.data]
      currentPage.value = page
    } else {
      myInvites.value = response.data.data
      currentPage.value = 1
    }
    
    hasMore.value = response.data.pagination.page < response.data.pagination.pages
  } catch (error) {
    console.error('获取邀请列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多邀请人
const loadMoreInvites = () => {
  if (!loading.value && hasMore.value) {
    fetchMyInvites(true)
  }
}

// 复制邀请码
const copyCode = async () => {
  if (!myInviteCode.value) return
  
  try {
    await navigator.clipboard.writeText(myInviteCode.value)
    alert('邀请码已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = myInviteCode.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('邀请码已复制到剪贴板')
  }
}

// 生成二维码
const generateQR = async () => {
  if (!myInviteCode.value) return
  
  showQRModal.value = true
  
  // 等待DOM更新
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (qrCanvas.value) {
    const inviteUrl = `${window.location.origin}/#/register?invite=${myInviteCode.value}`
    
    try {
      await QRCode.toCanvas(qrCanvas.value, inviteUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
    }
  }
}

// 下载二维码
const downloadQR = () => {
  if (!qrCanvas.value) return
  
  const link = document.createElement('a')
  link.download = `invite-qr-${myInviteCode.value}.png`
  link.href = qrCanvas.value.toDataURL()
  link.click()
}

// 分享邀请
const shareInvite = async () => {
  const inviteText = `加入Looge幸运团购，拼团抽奖，赢大奖！使用我的邀请码：${myInviteCode.value}\n${window.location.origin}/#/register?invite=${myInviteCode.value}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Looge幸运团购邀请',
        text: inviteText,
        url: `${window.location.origin}/#/register?invite=${myInviteCode.value}`
      })
    } catch (error) {
      copyToClipboard(inviteText)
    }
  } else {
    copyToClipboard(inviteText)
  }
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('邀请链接已复制到剪贴板')
  } catch (error) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('邀请链接已复制到剪贴板')
  }
}

// 工具函数
const goBack = () => {
  router.go(-1)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 页面加载
onMounted(() => {
  generateInviteCode()
  fetchInviteStats()
  fetchMyInvites()
})
</script>

<style scoped>
.invite-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: white;
}

.back-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
}

.invite-code-card,
.stats-card,
.commission-card,
.invites-list-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.invite-code-card h3,
.stats-card h3,
.commission-card h3,
.invites-list-card h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.code-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.code {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  font-family: monospace;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 8px;
  flex: 1;
}

.copy-btn {
  padding: 10px 15px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.code-actions {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-btn {
  background: #2196F3;
  color: white;
}

.share-btn {
  background: #FF9800;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.commission-levels {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.level-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.level {
  font-weight: bold;
  color: #333;
}

.rate {
  color: #4CAF50;
  font-weight: bold;
}

.invites-list {
  max-height: 300px;
  overflow-y: auto;
}

.invite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.invite-info {
  flex: 1;
}

.invite-name {
  font-weight: bold;
  color: #333;
}

.invite-time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.invite-balance {
  font-weight: bold;
  color: #4CAF50;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px;
}

.load-more {
  text-align: center;
  margin-top: 15px;
}

.load-more-btn {
  background: #667eea;
  color: white;
  padding: 10px 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
}

.qr-modal {
  text-align: center;
}

.qr-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.qr-code {
  border: 2px solid #eee;
  border-radius: 10px;
}

.qr-info {
  margin: 15px 0;
}

.qr-info .code {
  display: inline-block;
  font-size: 18px;
  background: #f5f5f5;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 5px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.download-btn {
  background: #4CAF50;
  color: white;
  flex: 1;
}

.close-btn {
  background: #ddd;
  color: #333;
  flex: 1;
}
</style>