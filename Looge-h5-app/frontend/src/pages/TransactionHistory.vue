<template>
  <div class="transaction-history-page">
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <h2>{{ $t('transactionHistory') || '交易记录' }}</h2>
      <div class="spacer"></div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        @click="activeFilter = filter.value"
        :class="['tab-btn', { active: activeFilter === filter.value }]"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Date Range Picker -->
    <div class="date-range">
      <select v-model="dateRange" @change="filterByDate" class="date-select">
        <option value="all">{{ $t('allTime') || '全部时间' }}</option>
        <option value="today">{{ $t('today') || '今天' }}</option>
        <option value="week">{{ $t('thisWeek') || '本周' }}</option>
        <option value="month">{{ $t('thisMonth') || '本月' }}</option>
      </select>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="stat-card income">
        <div class="stat-icon">📈</div>
        <div class="stat-content">
          <div class="stat-amount">+¥{{ totalIncome.toFixed(2) }}</div>
          <div class="stat-label">{{ $t('totalIncome') || '总收入' }}</div>
        </div>
      </div>
      <div class="stat-card expense">
        <div class="stat-icon">📉</div>
        <div class="stat-content">
          <div class="stat-amount">-¥{{ totalExpense.toFixed(2) }}</div>
          <div class="stat-label">{{ $t('totalExpense') || '总支出' }}</div>
        </div>
      </div>
    </div>

    <!-- Transaction List -->
    <div class="transaction-list">
      <div v-if="loading" class="loading">
        <p>{{ $t('loading') || '加载中...' }}</p>
      </div>
      
      <div v-else-if="filteredTransactions.length" class="transactions">
        <div 
          v-for="transaction in filteredTransactions" 
          :key="transaction.id" 
          class="transaction-item"
          @click="showTransactionDetail(transaction)"
        >
          <div class="transaction-icon" :class="transaction.type">
            {{ getTransactionIcon(transaction.type) }}
          </div>
          
          <div class="transaction-info">
            <div class="transaction-title">{{ transaction.title }}</div>
            <div class="transaction-details">
              <span class="transaction-time">{{ formatTime(transaction.createdAt) }}</span>
              <span v-if="transaction.status" class="transaction-status" :class="transaction.status">
                {{ getStatusText(transaction.status) }}
              </span>
            </div>
            <div v-if="transaction.description" class="transaction-desc">
              {{ transaction.description }}
            </div>
          </div>

          <div class="transaction-amount" :class="transaction.type">
            {{ transaction.type === 'recharge' || transaction.type === 'commission' || transaction.type === 'refund' ? '+' : '-' }}¥{{ transaction.amount.toFixed(2) }}
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <p>{{ $t('noTransactions') || '暂无交易记录' }}</p>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && !loading" class="load-more">
      <button @click="loadMore" class="load-more-btn">
        {{ $t('loadMore') || '加载更多' }}
      </button>
    </div>

    <!-- Transaction Detail Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('transactionDetail') || '交易详情' }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">{{ $t('transactionId') || '交易ID' }}:</span>
            <span class="detail-value">{{ selectedTransaction?.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ $t('type') || '类型' }}:</span>
            <span class="detail-value">{{ selectedTransaction?.title }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ $t('amount') || '金额' }}:</span>
            <span class="detail-value" :class="selectedTransaction?.type">
              {{ selectedTransaction?.type === 'recharge' || selectedTransaction?.type === 'commission' || selectedTransaction?.type === 'refund' ? '+' : '-' }}¥{{ selectedTransaction?.amount.toFixed(2) }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ $t('time') || '时间' }}:</span>
            <span class="detail-value">{{ formatFullTime(selectedTransaction?.createdAt) }}</span>
          </div>
          <div v-if="selectedTransaction?.status" class="detail-row">
            <span class="detail-label">{{ $t('status') || '状态' }}:</span>
            <span class="detail-value" :class="selectedTransaction?.status">{{ getStatusText(selectedTransaction?.status) }}</span>
          </div>
          <div v-if="selectedTransaction?.description" class="detail-row">
            <span class="detail-label">{{ $t('description') || '说明' }}:</span>
            <span class="detail-value">{{ selectedTransaction?.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getFinance } from '../api/index.js';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const transactions = ref([]);
const activeFilter = ref('all');
const dateRange = ref('all');
const loading = ref(false);
const hasMore = ref(true);
const showModal = ref(false);
const selectedTransaction = ref(null);

const filters = [
  { value: 'all', label: t('all') || '全部' },
  { value: 'recharge', label: t('recharge') || '充值' },
  { value: 'withdraw', label: t('withdraw') || '提现' },
  { value: 'consume', label: t('consume') || '消费' },
  { value: 'commission', label: t('commission') || '佣金' },
  { value: 'refund', label: t('refund') || '退款' }
];

const filteredTransactions = computed(() => {
  let filtered = transactions.value;
  
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(t => t.type === activeFilter.value);
  }
  
  return filtered;
});

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => ['recharge', 'commission', 'refund'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => ['withdraw', 'consume'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);
});

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  
  // Set filter from query parameter
  if (route.query.type) {
    activeFilter.value = route.query.type;
  }
  
  await loadTransactions();
});

async function loadTransactions() {
  loading.value = true;
  try {
    const res = await getFinance();
    transactions.value = res.data || [];
    
    // Mock more data for demo
    if (!transactions.value.length) {
      transactions.value = generateMockTransactions();
    }
  } catch (error) {
    console.error('Failed to load transactions:', error);
    transactions.value = generateMockTransactions();
  } finally {
    loading.value = false;
  }
}

function generateMockTransactions() {
  return [
    {
      id: 'TXN001',
      type: 'recharge',
      title: '账户充值',
      amount: 500,
      status: 'completed',
      description: '微信支付充值',
      createdAt: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 'TXN002',
      type: 'consume',
      title: '参与团购 - iPhone 15 Pro',
      amount: 99,
      status: 'completed',
      description: '团购商品支付',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: 'TXN003',
      type: 'commission',
      title: '推荐佣金',
      amount: 25.50,
      status: 'completed',
      description: '来自用户 ABC123 的佣金',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
    },
    {
      id: 'TXN004',
      type: 'withdraw',
      title: '提现申请',
      amount: 200,
      status: 'pending',
      description: '提现到工商银行',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: 'TXN005',
      type: 'refund',
      title: '团购退款',
      amount: 50,
      status: 'completed',
      description: '团购未成功退款',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
      id: 'TXN006',
      type: 'commission',
      title: '团队佣金',
      amount: 15.80,
      status: 'completed',
      description: '二级推荐佣金',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    }
  ];
}

function filterByDate() {
  // Implementation for date filtering
  // This would typically make a new API call with date parameters
}

function loadMore() {
  // Implementation for pagination
  hasMore.value = false; // For demo purposes
}

function showTransactionDetail(transaction) {
  selectedTransaction.value = transaction;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedTransaction.value = null;
}

function formatTime(time) {
  if (!time) return '';
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString();
  }
}

function formatFullTime(time) {
  if (!time) return '';
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getTransactionIcon(type) {
  const icons = {
    recharge: '💰',
    withdraw: '💸',
    consume: '🛒',
    commission: '🎁',
    refund: '↩️'
  };
  return icons[type] || '💳';
}

function getStatusText(status) {
  const texts = {
    completed: '已完成',
    pending: '处理中',
    failed: '失败',
    cancelled: '已取消'
  };
  return texts[status] || status;
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.transaction-history-page {
  min-height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 50%, #bbdefb 100%);
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #1976d2;
  cursor: pointer;
  padding: 5px;
  margin-right: 15px;
}

.header h2 {
  flex: 1;
  text-align: center;
  color: #1976d2;
  margin: 0;
  font-size: 1.5rem;
}

.spacer {
  width: 40px;
}

.filter-tabs {
  display: flex;
  background: white;
  padding: 15px 20px 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;
  white-space: nowrap;
  font-size: 0.9rem;
}

.tab-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.date-range {
  padding: 15px 20px;
  background: white;
  border-bottom: 10px solid #f5f5f5;
}

.date-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 20px;
  background: white;
  margin-bottom: 10px;
}

.stat-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-card.income {
  border-left: 4px solid #4caf50;
}

.stat-card.expense {
  border-left: 4px solid #f44336;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-amount {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-card.income .stat-amount {
  color: #4caf50;
}

.stat-card.expense .stat-amount {
  color: #f44336;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.transaction-list {
  background: white;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.transaction-item:hover {
  background: #e3f2fd;
}

.transaction-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
}

.transaction-icon.recharge,
.transaction-icon.commission,
.transaction-icon.refund {
  background: #4caf50;
}

.transaction-icon.withdraw,
.transaction-icon.consume {
  background: #ff9800;
}

.transaction-info {
  flex: 1;
}

.transaction-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.transaction-details {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 3px;
}

.transaction-time {
  font-size: 0.8rem;
  color: #999;
}

.transaction-status {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.transaction-status.completed {
  background: #e8f5e8;
  color: #4caf50;
}

.transaction-status.pending {
  background: #fff3e0;
  color: #ff9800;
}

.transaction-status.failed {
  background: #ffebee;
  color: #f44336;
}

.transaction-desc {
  font-size: 0.8rem;
  color: #666;
}

.transaction-amount {
  font-weight: 700;
  font-size: 1.1rem;
}

.transaction-amount.recharge,
.transaction-amount.commission,
.transaction-amount.refund {
  color: #4caf50;
}

.transaction-amount.withdraw,
.transaction-amount.consume {
  color: #f44336;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.load-more {
  text-align: center;
  padding: 20px;
}

.load-more-btn {
  padding: 12px 30px;
  border: 1px solid #1976d2;
  border-radius: 25px;
  background: transparent;
  color: #1976d2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: #1976d2;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 25px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  line-height: 1;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detail-label {
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

.detail-value {
  color: #333;
  text-align: right;
  word-break: break-all;
}

.detail-value.recharge,
.detail-value.commission,
.detail-value.refund {
  color: #4caf50;
}

.detail-value.withdraw,
.detail-value.consume {
  color: #f44336;
}

.detail-value.completed {
  color: #4caf50;
}

.detail-value.pending {
  color: #ff9800;
}

.detail-value.failed {
  color: #f44336;
}

@media (max-width: 768px) {
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .transaction-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .transaction-info {
    width: 100%;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .detail-value {
    text-align: left;
  }
}
</style>