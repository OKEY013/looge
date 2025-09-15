<template>
  <div class="wallet-container">
    <!-- Header -->
    <div class="header">
      <button @click="goBack" class="back-btn">← {{ $t('back') }}</button>
      <h2>{{ $t('wallet') }}</h2>
    </div>

    <!-- Balance Card -->
    <div class="balance-card">
      <div class="balance-info">
        <h3>{{ $t('balance') }}</h3>
        <div class="balance-amount">¥{{ balance.toFixed(2) }}</div>
      </div>
      <div class="balance-actions">
        <button @click="showRechargeModal = true" class="btn recharge-btn">
          {{ $t('recharge') }}
        </button>
        <button @click="showWithdrawModal = true" class="btn withdraw-btn">
          {{ $t('withdraw') }}
        </button>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="transaction-section">
      <h3>{{ $t('financeRecords') }}</h3>
      
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          v-for="tab in filterTabs" 
          :key="tab.value"
          @click="selectedFilter = tab.value; fetchTransactions()"
          :class="{ active: selectedFilter === tab.value }"
          class="filter-tab"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Transaction List -->
      <div class="transaction-list">
        <div 
          v-for="transaction in transactions" 
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-info">
            <div class="transaction-type">
              <span :class="getTransactionTypeClass(transaction.type)">
                {{ getTransactionTypeText(transaction.type) }}
              </span>
            </div>
            <div class="transaction-time">
              {{ formatDate(transaction.created_at) }}
            </div>
            <div class="transaction-desc" v-if="transaction.description">
              {{ transaction.description }}
            </div>
          </div>
          <div class="transaction-amount">
            <span :class="getAmountClass(transaction.type)">
              {{ getAmountPrefix(transaction.type) }}¥{{ transaction.amount }}
            </span>
            <div class="transaction-status">
              {{ getStatusText(transaction.status) }}
            </div>
          </div>
        </div>
        
        <div v-if="transactions.length === 0" class="no-data">
          {{ $t('noData') }}
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="load-more">
        <button @click="loadMore" :disabled="loading" class="btn load-more-btn">
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>

    <!-- Recharge Modal -->
    <div v-if="showRechargeModal" class="modal-overlay" @click="showRechargeModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ $t('recharge') }}</h3>
        <div class="amount-input">
          <label>充值金额</label>
          <input 
            type="number" 
            v-model="rechargeAmount" 
            placeholder="请输入充值金额"
            min="1"
            step="0.01"
          >
        </div>
        <div class="modal-buttons">
          <button @click="showRechargeModal = false" class="btn cancel-btn">取消</button>
          <button @click="handleRecharge" :disabled="!rechargeAmount || rechargeAmount <= 0" class="btn confirm-btn">
            确认充值
          </button>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="modal-overlay" @click="showWithdrawModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ $t('withdraw') }}</h3>
        <div class="amount-input">
          <label>提现金额</label>
          <input 
            type="number" 
            v-model="withdrawAmount" 
            placeholder="请输入提现金额"
            min="1"
            step="0.01"
            :max="balance"
          >
          <div class="balance-hint">可提现余额: ¥{{ balance.toFixed(2) }}</div>
        </div>
        <div class="modal-buttons">
          <button @click="showWithdrawModal = false" class="btn cancel-btn">取消</button>
          <button @click="handleWithdraw" :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > balance" class="btn confirm-btn">
            确认提现
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../api/index.js'

const router = useRouter()
const { t } = useI18n()

// 响应式数据
const balance = ref(0)
const transactions = ref([])
const selectedFilter = ref('all')
const currentPage = ref(1)
const hasMore = ref(true)
const loading = ref(false)

// 模态框
const showRechargeModal = ref(false)
const showWithdrawModal = ref(false)
const rechargeAmount = ref('')
const withdrawAmount = ref('')

// 筛选选项
const filterTabs = ref([
  { value: 'all', label: '全部' },
  { value: 'recharge', label: '充值' },
  { value: 'withdraw', label: '提现' },
  { value: 'commission', label: '佣金' },
  { value: 'refund', label: '退款' }
])

// 获取余额
const fetchBalance = async () => {
  try {
    const response = await api.get('/wallet/balance')
    balance.value = response.data.balance || 0
  } catch (error) {
    console.error('获取余额失败:', error)
  }
}

// 获取交易记录
const fetchTransactions = async (isLoadMore = false) => {
  try {
    loading.value = true
    const page = isLoadMore ? currentPage.value + 1 : 1
    const params = {
      page,
      limit: 20
    }
    
    if (selectedFilter.value !== 'all') {
      params.type = selectedFilter.value
    }
    
    const response = await api.get('/wallet/transactions', { params })
    
    if (isLoadMore) {
      transactions.value = [...transactions.value, ...response.data.data]
      currentPage.value = page
    } else {
      transactions.value = response.data.data
      currentPage.value = 1
    }
    
    hasMore.value = response.data.pagination.page < response.data.pagination.pages
  } catch (error) {
    console.error('获取交易记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    fetchTransactions(true)
  }
}

// 充值
const handleRecharge = async () => {
  try {
    const response = await api.post('/wallet/recharge', {
      amount: parseFloat(rechargeAmount.value)
    })
    
    if (response.data.success) {
      alert('充值成功！')
      balance.value = response.data.new_balance
      rechargeAmount.value = ''
      showRechargeModal.value = false
      fetchTransactions()
    }
  } catch (error) {
    alert('充值失败: ' + (error.response?.data?.error || error.message))
  }
}

// 提现
const handleWithdraw = async () => {
  try {
    const response = await api.post('/wallet/withdraw', {
      amount: parseFloat(withdrawAmount.value)
    })
    
    if (response.data.success) {
      alert('提现申请已提交，请等待审核！')
      balance.value = response.data.new_balance
      withdrawAmount.value = ''
      showWithdrawModal.value = false
      fetchTransactions()
    }
  } catch (error) {
    alert('提现失败: ' + (error.response?.data?.error || error.message))
  }
}

// 工具函数
const goBack = () => {
  router.go(-1)
}

const getTransactionTypeClass = (type) => {
  const classes = {
    recharge: 'type-recharge',
    withdraw: 'type-withdraw',
    commission: 'type-commission',
    refund: 'type-refund',
    prize: 'type-prize',
    fee: 'type-fee'
  }
  return classes[type] || 'type-default'
}

const getTransactionTypeText = (type) => {
  const texts = {
    recharge: '充值',
    withdraw: '提现',
    commission: '佣金',
    refund: '退款',
    prize: '奖品',
    fee: '手续费'
  }
  return texts[type] || type
}

const getAmountClass = (type) => {
  return ['recharge', 'commission', 'refund', 'prize'].includes(type) ? 'amount-positive' : 'amount-negative'
}

const getAmountPrefix = (type) => {
  return ['recharge', 'commission', 'refund', 'prize'].includes(type) ? '+' : '-'
}

const getStatusText = (status) => {
  const texts = {
    pending: '处理中',
    completed: '已完成',
    failed: '失败',
    cancelled: '已取消'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 页面加载
onMounted(() => {
  fetchBalance()
  fetchTransactions()
})
</script>

<style scoped>
.wallet-container {
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

.balance-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.balance-info {
  text-align: center;
  margin-bottom: 20px;
}

.balance-info h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.balance-actions {
  display: flex;
  gap: 15px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recharge-btn {
  background: #4CAF50;
  color: white;
}

.withdraw-btn {
  background: #FF6B6B;
  color: white;
}

.transaction-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.filter-tab {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.filter-tab.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.transaction-list {
  max-height: 400px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.transaction-info {
  flex: 1;
}

.transaction-type span {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.type-recharge { background: #E8F5E8; color: #4CAF50; }
.type-withdraw { background: #FFE8E8; color: #FF6B6B; }
.type-commission { background: #E8F4FF; color: #2196F3; }
.type-refund { background: #FFF8E1; color: #FF9800; }
.type-prize { background: #F3E5F5; color: #9C27B0; }
.type-fee { background: #EEEEEE; color: #757575; }

.transaction-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.transaction-desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.transaction-amount {
  text-align: right;
}

.amount-positive {
  color: #4CAF50;
  font-weight: bold;
}

.amount-negative {
  color: #FF6B6B;
  font-weight: bold;
}

.transaction-status {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
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

.modal-content h3 {
  margin: 0 0 20px 0;
  text-align: center;
}

.amount-input {
  margin-bottom: 20px;
}

.amount-input label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.amount-input input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.balance-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  background: #ddd;
  color: #333;
  flex: 1;
}

.confirm-btn {
  background: #667eea;
  color: white;
  flex: 1;
}

.confirm-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>