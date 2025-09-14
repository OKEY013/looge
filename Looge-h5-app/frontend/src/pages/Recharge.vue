<template>
  <div class="recharge-page">
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <h2>{{ $t('recharge') }}</h2>
      <div class="spacer"></div>
    </div>

    <!-- Current Balance -->
    <div class="balance-info">
      <div class="balance-label">{{ $t('currentBalance') || '当前余额' }}</div>
      <div class="balance-amount">¥{{ currentBalance.toFixed(2) }}</div>
    </div>

    <!-- Quick Amount Selection -->
    <div class="amount-section">
      <h3>{{ $t('selectAmount') || '选择充值金额' }}</h3>
      <div class="quick-amounts">
        <button 
          v-for="amount in quickAmounts" 
          :key="amount"
          @click="selectedAmount = amount"
          :class="['amount-btn', { active: selectedAmount === amount }]"
        >
          ¥{{ amount }}
        </button>
      </div>
      
      <!-- Custom Amount Input -->
      <div class="custom-amount">
        <label>{{ $t('customAmount') || '自定义金额' }}</label>
        <div class="input-wrapper">
          <span class="currency">¥</span>
          <input 
            v-model.number="customAmount" 
            type="number" 
            :placeholder="$t('enterAmount') || '请输入金额'" 
            min="1"
            max="10000"
            @input="onCustomAmountInput"
          />
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="payment-section">
      <h3>{{ $t('paymentMethod') || '支付方式' }}</h3>
      <div class="payment-methods">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          @click="selectedPayment = method.id"
          :class="['payment-method', { active: selectedPayment === method.id }]"
        >
          <div class="payment-icon">{{ method.icon }}</div>
          <div class="payment-info">
            <div class="payment-name">{{ method.name }}</div>
            <div class="payment-desc">{{ method.description }}</div>
          </div>
          <div class="radio-btn" :class="{ checked: selectedPayment === method.id }"></div>
        </div>
      </div>
    </div>

    <!-- Bonus Information -->
    <div class="bonus-info" v-if="bonusAmount > 0">
      <div class="bonus-card">
        <div class="bonus-icon">🎁</div>
        <div class="bonus-text">
          <div class="bonus-title">{{ $t('rechargeBonus') || '充值奖励' }}</div>
          <div class="bonus-amount">+¥{{ bonusAmount.toFixed(2) }}</div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-section">
      <div class="summary-row">
        <span>{{ $t('rechargeAmount') || '充值金额' }}</span>
        <span>¥{{ finalAmount.toFixed(2) }}</span>
      </div>
      <div class="summary-row" v-if="bonusAmount > 0">
        <span>{{ $t('bonus') || '奖励金额' }}</span>
        <span class="bonus">+¥{{ bonusAmount.toFixed(2) }}</span>
      </div>
      <div class="summary-row total">
        <span>{{ $t('totalReceived') || '实际到账' }}</span>
        <span>¥{{ (finalAmount + bonusAmount).toFixed(2) }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button 
        @click="processRecharge" 
        :disabled="!canRecharge"
        class="recharge-btn"
      >
        {{ processing ? $t('processing') || '处理中...' : $t('confirmRecharge') || '确认充值' }}
      </button>
    </div>

    <!-- Recent Recharge History -->
    <div class="recent-history">
      <h3>{{ $t('recentRecharges') || '最近充值记录' }}</h3>
      <div v-if="recentRecharges.length" class="history-list">
        <div 
          v-for="record in recentRecharges.slice(0, 3)" 
          :key="record.id" 
          class="history-item"
        >
          <div class="history-icon" :class="record.status">
            {{ getStatusIcon(record.status) }}
          </div>
          <div class="history-details">
            <div class="history-amount">¥{{ record.amount.toFixed(2) }}</div>
            <div class="history-method">{{ record.paymentMethod }}</div>
            <div class="history-time">{{ formatTime(record.createdAt) }}</div>
          </div>
          <div class="history-status" :class="record.status">
            {{ getStatusText(record.status) }}
          </div>
        </div>
      </div>
      <div v-else class="no-history">
        <p>{{ $t('noRechargeHistory') || '暂无充值记录' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProfile, recharge } from '../api/index.js';

const router = useRouter();
const { t } = useI18n();

const currentBalance = ref(0);
const selectedAmount = ref(0);
const customAmount = ref('');
const selectedPayment = ref('wechat');
const processing = ref(false);
const recentRecharges = ref([]);

const quickAmounts = [50, 100, 200, 500, 1000, 2000];

const paymentMethods = [
  {
    id: 'wechat',
    name: '微信支付',
    description: '安全便捷，支持零钱和银行卡',
    icon: '💚'
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '快速到账，支持花呗付款',
    icon: '🟦'
  },
  {
    id: 'bank',
    name: '银行卡',
    description: '支持各大银行储蓄卡和信用卡',
    icon: '💳'
  }
];

const finalAmount = computed(() => {
  return selectedAmount.value || parseFloat(customAmount.value) || 0;
});

const bonusAmount = computed(() => {
  const amount = finalAmount.value;
  if (amount >= 1000) return amount * 0.1; // 10% bonus for 1000+
  if (amount >= 500) return amount * 0.05;  // 5% bonus for 500+
  if (amount >= 200) return amount * 0.02;  // 2% bonus for 200+
  return 0;
});

const canRecharge = computed(() => {
  return finalAmount.value >= 1 && finalAmount.value <= 10000 && selectedPayment.value && !processing.value;
});

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadUserData();
});

async function loadUserData() {
  try {
    const res = await getProfile();
    currentBalance.value = res.data?.balance || 0;
    
    // Mock recent recharge history
    recentRecharges.value = [
      {
        id: 1,
        amount: 500,
        paymentMethod: '微信支付',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: 2,
        amount: 200,
        paymentMethod: '支付宝',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: 3,
        amount: 100,
        paymentMethod: '银行卡',
        status: 'success',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
      }
    ];
  } catch (error) {
    console.error('Failed to load user data:', error);
    currentBalance.value = 1580.50;
  }
}

function onCustomAmountInput() {
  selectedAmount.value = 0; // Clear quick amount selection when custom input is used
}

async function processRecharge() {
  if (!canRecharge.value) return;
  
  processing.value = true;
  
  try {
    const amount = finalAmount.value;
    const paymentData = {
      amount,
      paymentMethod: selectedPayment.value,
      bonusAmount: bonusAmount.value
    };
    
    const response = await recharge(paymentData);
    
    if (response.data?.paymentUrl) {
      // Redirect to payment page
      window.location.href = response.data.paymentUrl;
    } else {
      // Mock successful recharge
      alert(`充值成功！充值金额：¥${amount.toFixed(2)}${bonusAmount.value > 0 ? `，奖励：¥${bonusAmount.value.toFixed(2)}` : ''}`);
      currentBalance.value += amount + bonusAmount.value;
      
      // Add to recent history
      recentRecharges.value.unshift({
        id: Date.now(),
        amount,
        paymentMethod: paymentMethods.find(m => m.id === selectedPayment.value)?.name,
        status: 'success',
        createdAt: new Date()
      });
      
      // Reset form
      selectedAmount.value = 0;
      customAmount.value = '';
    }
  } catch (error) {
    alert('充值失败，请稍后重试');
    console.error('Recharge failed:', error);
  } finally {
    processing.value = false;
  }
}

function formatTime(time) {
  if (!time) return '';
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (hours < 24) {
    return `${hours}小时前`;
  } else {
    return `${days}天前`;
  }
}

function getStatusIcon(status) {
  const icons = {
    success: '✓',
    pending: '⏳',
    failed: '✗'
  };
  return icons[status] || '●';
}

function getStatusText(status) {
  const texts = {
    success: '成功',
    pending: '处理中',
    failed: '失败'
  };
  return texts[status] || status;
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.recharge-page {
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

.balance-info {
  background: white;
  padding: 25px;
  text-align: center;
  border-bottom: 10px solid #f5f5f5;
}

.balance-label {
  color: #666;
  font-size: 1rem;
  margin-bottom: 10px;
}

.balance-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
}

.amount-section,
.payment-section,
.recent-history {
  background: white;
  padding: 25px;
  margin-bottom: 10px;
}

.amount-section h3,
.payment-section h3,
.recent-history h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 25px;
}

.amount-btn {
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.amount-btn:hover {
  border-color: #1976d2;
}

.amount-btn.active {
  border-color: #1976d2;
  background: #1976d2;
  color: white;
}

.custom-amount {
  margin-bottom: 20px;
}

.custom-amount label {
  display: block;
  color: #666;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 15px;
  color: #666;
  font-weight: 600;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 15px 15px 15px 35px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #1976d2;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #1976d2;
}

.payment-method.active {
  border-color: #1976d2;
  background: #f8f9fa;
}

.payment-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.payment-desc {
  font-size: 0.85rem;
  color: #666;
}

.radio-btn {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-btn.checked {
  border-color: #1976d2;
}

.radio-btn.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #1976d2;
  border-radius: 50%;
}

.bonus-info {
  padding: 0 25px 25px;
}

.bonus-card {
  background: linear-gradient(135deg, #4caf50, #8bc34a);
  color: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.bonus-icon {
  font-size: 2rem;
}

.bonus-title {
  font-size: 1rem;
  margin-bottom: 5px;
}

.bonus-amount {
  font-size: 1.3rem;
  font-weight: 700;
}

.summary-section {
  background: white;
  padding: 25px;
  margin-bottom: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1976d2;
}

.bonus {
  color: #4caf50;
  font-weight: 600;
}

.action-buttons {
  padding: 25px;
}

.recharge-btn {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recharge-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.recharge-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.history-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.history-icon.success {
  background: #4caf50;
}

.history-icon.pending {
  background: #ff9800;
}

.history-icon.failed {
  background: #f44336;
}

.history-details {
  flex: 1;
}

.history-amount {
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.history-method {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 3px;
}

.history-time {
  font-size: 0.8rem;
  color: #999;
}

.history-status {
  font-size: 0.9rem;
  font-weight: 500;
}

.history-status.success {
  color: #4caf50;
}

.history-status.pending {
  color: #ff9800;
}

.history-status.failed {
  color: #f44336;
}

.no-history {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .quick-amounts {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .balance-amount {
    font-size: 2rem;
  }
}
</style>