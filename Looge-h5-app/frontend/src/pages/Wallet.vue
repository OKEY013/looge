<template>
  <div class="wallet-page">
    <div class="header">
      <h2>{{ $t('wallet') }}</h2>
      <p class="subtitle">{{ $t('walletSubtitle') || '管理您的账户资金' }}</p>
    </div>

    <!-- Balance Section -->
    <div class="balance-card">
      <div class="balance-header">
        <span class="balance-label">{{ $t('balance') }}</span>
        <button @click="refreshBalance" class="refresh-btn" :disabled="loading">
          <span>{{ loading ? '刷新中...' : '刷新' }}</span>
        </button>
      </div>
      <div class="balance-amount">¥{{ formatAmount(userBalance) }}</div>
      <div class="balance-actions">
        <button @click="goToRecharge" class="action-btn recharge-btn">
          <span>{{ $t('recharge') }}</span>
        </button>
        <button @click="goToWithdraw" class="action-btn withdraw-btn">
          <span>{{ $t('withdraw') }}</span>
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="action-grid">
        <div class="action-item" @click="goToTransactionHistory">
          <div class="action-icon">📊</div>
          <span>{{ $t('transactionHistory') || '交易记录' }}</span>
        </div>
        <div class="action-item" @click="goToRechargeHistory">
          <div class="action-icon">💰</div>
          <span>{{ $t('rechargeHistory') || '充值记录' }}</span>
        </div>
        <div class="action-item" @click="goToWithdrawHistory">
          <div class="action-icon">💸</div>
          <span>{{ $t('withdrawHistory') || '提现记录' }}</span>
        </div>
        <div class="action-item" @click="goToCommissionHistory">
          <div class="action-icon">🎁</div>
          <span>{{ $t('commissionHistory') || '返利记录' }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="recent-transactions">
      <h3>{{ $t('recentTransactions') || '最近交易' }}</h3>
      <div v-if="transactions.length" class="transaction-list">
        <div 
          v-for="transaction in transactions.slice(0, 5)" 
          :key="transaction.id" 
          class="transaction-item"
        >
          <div class="transaction-icon" :class="transaction.type">
            {{ getTransactionIcon(transaction.type) }}
          </div>
          <div class="transaction-info">
            <div class="transaction-title">{{ transaction.title }}</div>
            <div class="transaction-time">{{ formatTime(transaction.createdAt) }}</div>
          </div>
          <div class="transaction-amount" :class="transaction.type">
            {{ transaction.type === 'recharge' || transaction.type === 'commission' ? '+' : '-' }}¥{{ formatAmount(transaction.amount) }}
          </div>
        </div>
      </div>
      <div v-else class="empty-transactions">
        <p>{{ $t('noTransactions') || '暂无交易记录' }}</p>
      </div>
      <button @click="goToTransactionHistory" class="view-all-btn">
        {{ $t('viewAll') || '查看全部' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProfile, getFinance } from '../api/index.js';

const router = useRouter();
const { t } = useI18n();

const userBalance = ref(0);
const transactions = ref([]);
const loading = ref(false);

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadWalletData();
});

async function loadWalletData() {
  loading.value = true;
  try {
    // Load user balance
    const profileRes = await getProfile();
    userBalance.value = profileRes.data?.balance || 0;

    // Load recent transactions
    const financeRes = await getFinance();
    transactions.value = financeRes.data || [];
  } catch (error) {
    console.error('Failed to load wallet data:', error);
    // Mock data for demo
    userBalance.value = 1580.50;
    transactions.value = [
      {
        id: 1,
        type: 'recharge',
        title: '账户充值',
        amount: 500,
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        type: 'consume',
        title: '参与团购 - 精美手表',
        amount: 99,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: 3,
        type: 'commission',
        title: '推荐佣金',
        amount: 25.50,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
      },
      {
        id: 4,
        type: 'withdraw',
        title: '提现申请',
        amount: 200,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ];
  } finally {
    loading.value = false;
  }
}

async function refreshBalance() {
  await loadWalletData();
}

function formatAmount(amount) {
  return typeof amount === 'number' ? amount.toFixed(2) : '0.00';
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

function goToRecharge() {
  router.push('/recharge');
}

function goToWithdraw() {
  router.push('/withdraw');
}

function goToTransactionHistory() {
  router.push('/transaction-history');
}

function goToRechargeHistory() {
  router.push('/transaction-history?type=recharge');
}

function goToWithdrawHistory() {
  router.push('/transaction-history?type=withdraw');
}

function goToCommissionHistory() {
  router.push('/transaction-history?type=commission');
}
</script>

<style scoped>
.wallet-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 50%, #bbdefb 100%);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.balance-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
  text-align: center;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.balance-label {
  font-size: 1.1rem;
  color: #666;
}

.refresh-btn {
  background: none;
  border: 1px solid #1976d2;
  color: #1976d2;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #1976d2;
  color: white;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.balance-amount {
  font-size: 3rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.balance-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  flex: 1;
  max-width: 120px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recharge-btn {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
}

.recharge-btn:hover {
  background: linear-gradient(135deg, #45a049, #7cb342);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.withdraw-btn {
  background: linear-gradient(135deg, #ff9800, #ffc107);
  color: white;
}

.withdraw-btn:hover {
  background: linear-gradient(135deg, #f57c00, #ffb300);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

.quick-actions {
  margin-bottom: 30px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.action-item {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.action-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.action-item span {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.recent-transactions {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.recent-transactions h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.transaction-list {
  margin-bottom: 20px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.transaction-item:hover {
  background: #e3f2fd;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
}

.transaction-icon.recharge,
.transaction-icon.commission {
  background: #e8f5e8;
}

.transaction-icon.withdraw,
.transaction-icon.consume {
  background: #fff3e0;
}

.transaction-info {
  flex: 1;
}

.transaction-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.transaction-time {
  font-size: 0.8rem;
  color: #666;
}

.transaction-amount {
  font-weight: 600;
  font-size: 1.1rem;
}

.transaction-amount.recharge,
.transaction-amount.commission {
  color: #4caf50;
}

.transaction-amount.withdraw,
.transaction-amount.consume {
  color: #f44336;
}

.empty-transactions {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.view-all-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid #1976d2;
  border-radius: 8px;
  background: transparent;
  color: #1976d2;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: #1976d2;
  color: white;
}

@media (max-width: 768px) {
  .wallet-page {
    padding: 15px;
  }
  
  .balance-amount {
    font-size: 2.5rem;
  }
  
  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .balance-actions {
    flex-direction: column;
  }
  
  .action-btn {
    max-width: none;
  }
}
</style>