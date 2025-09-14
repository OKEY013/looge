<template>
  <div class="withdraw-page">
    <div class="header">
      <button @click="goBack" class="back-btn">←</button>
      <h2>{{ $t('withdraw') }}</h2>
      <div class="spacer"></div>
    </div>

    <!-- Available Balance -->
    <div class="balance-info">
      <div class="balance-label">{{ $t('availableBalance') || '可提现余额' }}</div>
      <div class="balance-amount">¥{{ availableBalance.toFixed(2) }}</div>
      <div class="balance-note">{{ $t('minWithdraw') || '最低提现金额：¥50' }}</div>
    </div>

    <!-- Withdraw Form -->
    <div class="withdraw-form">
      <!-- Amount Input -->
      <div class="form-section">
        <h3>{{ $t('withdrawAmount') || '提现金额' }}</h3>
        <div class="amount-input">
          <div class="input-wrapper">
            <span class="currency">¥</span>
            <input 
              v-model.number="withdrawAmount" 
              type="number" 
              :placeholder="$t('enterWithdrawAmount') || '请输入提现金额'" 
              min="50"
              :max="availableBalance"
              @input="validateAmount"
            />
          </div>
          <button @click="withdrawAll" class="all-btn">{{ $t('withdrawAll') || '全部提现' }}</button>
        </div>
        <div v-if="amountError" class="error-message">{{ amountError }}</div>
      </div>

      <!-- Quick Amount Selection -->
      <div class="quick-amounts">
        <button 
          v-for="amount in quickAmounts.filter(a => a <= availableBalance)" 
          :key="amount"
          @click="withdrawAmount = amount"
          :class="['amount-btn', { active: withdrawAmount === amount }]"
        >
          ¥{{ amount }}
        </button>
      </div>

      <!-- Bank Account Selection -->
      <div class="form-section">
        <h3>{{ $t('bankAccount') || '提现账户' }}</h3>
        <div class="bank-accounts">
          <div 
            v-for="account in bankAccounts" 
            :key="account.id"
            @click="selectedAccount = account.id"
            :class="['bank-account', { active: selectedAccount === account.id }]"
          >
            <div class="bank-icon">🏦</div>
            <div class="bank-info">
              <div class="bank-name">{{ account.bankName }}</div>
              <div class="account-number">**** **** **** {{ account.accountNumber.slice(-4) }}</div>
              <div class="account-holder">{{ account.holderName }}</div>
            </div>
            <div class="radio-btn" :class="{ checked: selectedAccount === account.id }"></div>
          </div>
        </div>
        <button @click="showAddAccount = true" class="add-account-btn">
          + {{ $t('addBankAccount') || '添加银行账户' }}
        </button>
      </div>

      <!-- Fee Information -->
      <div class="fee-info">
        <div class="fee-card">
          <div class="fee-row">
            <span>{{ $t('withdrawAmount') || '提现金额' }}</span>
            <span>¥{{ withdrawAmount.toFixed(2) }}</span>
          </div>
          <div class="fee-row">
            <span>{{ $t('serviceFee') || '手续费' }} ({{ feeRate * 100 }}%)</span>
            <span>-¥{{ serviceFee.toFixed(2) }}</span>
          </div>
          <div class="fee-row total">
            <span>{{ $t('actualReceived') || '实际到账' }}</span>
            <span>¥{{ actualReceived.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="submit-section">
        <button 
          @click="submitWithdraw" 
          :disabled="!canSubmit"
          class="submit-btn"
        >
          {{ processing ? $t('processing') || '提交中...' : $t('submitWithdraw') || '提交提现申请' }}
        </button>
        <div class="submit-note">
          {{ $t('withdrawNote') || '提现申请提交后，将在1-3个工作日内处理完成' }}
        </div>
      </div>
    </div>

    <!-- Withdraw History -->
    <div class="withdraw-history">
      <h3>{{ $t('withdrawHistory') || '提现记录' }}</h3>
      <div v-if="withdrawHistory.length" class="history-list">
        <div 
          v-for="record in withdrawHistory.slice(0, 5)" 
          :key="record.id" 
          class="history-item"
        >
          <div class="history-icon" :class="record.status">
            {{ getStatusIcon(record.status) }}
          </div>
          <div class="history-details">
            <div class="history-amount">¥{{ record.amount.toFixed(2) }}</div>
            <div class="history-bank">{{ record.bankName }} {{ record.accountNumber }}</div>
            <div class="history-time">{{ formatTime(record.createdAt) }}</div>
          </div>
          <div class="history-status" :class="record.status">
            {{ getStatusText(record.status) }}
          </div>
        </div>
      </div>
      <div v-else class="no-history">
        <p>{{ $t('noWithdrawHistory') || '暂无提现记录' }}</p>
      </div>
    </div>

    <!-- Add Bank Account Modal -->
    <div v-if="showAddAccount" class="modal-overlay" @click="showAddAccount = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('addBankAccount') || '添加银行账户' }}</h3>
          <button @click="showAddAccount = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('bankName') || '银行名称' }}</label>
            <input v-model="newAccount.bankName" type="text" :placeholder="$t('enterBankName') || '请输入银行名称'" />
          </div>
          <div class="form-group">
            <label>{{ $t('accountNumber') || '银行账号' }}</label>
            <input v-model="newAccount.accountNumber" type="text" :placeholder="$t('enterAccountNumber') || '请输入银行账号'" />
          </div>
          <div class="form-group">
            <label>{{ $t('holderName') || '持卡人姓名' }}</label>
            <input v-model="newAccount.holderName" type="text" :placeholder="$t('enterHolderName') || '请输入持卡人姓名'" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showAddAccount = false" class="cancel-btn">{{ $t('cancel') || '取消' }}</button>
          <button @click="addBankAccount" class="confirm-btn">{{ $t('confirm') || '确认添加' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProfile, withdraw } from '../api/index.js';

const router = useRouter();
const { t } = useI18n();

const availableBalance = ref(0);
const withdrawAmount = ref(0);
const selectedAccount = ref(null);
const processing = ref(false);
const amountError = ref('');
const showAddAccount = ref(false);

const bankAccounts = ref([]);
const withdrawHistory = ref([]);
const newAccount = ref({
  bankName: '',
  accountNumber: '',
  holderName: ''
});

const quickAmounts = [50, 100, 200, 500, 1000, 2000];
const feeRate = 0.02; // 2% service fee

const serviceFee = computed(() => {
  return withdrawAmount.value * feeRate;
});

const actualReceived = computed(() => {
  return Math.max(0, withdrawAmount.value - serviceFee.value);
});

const canSubmit = computed(() => {
  return withdrawAmount.value >= 50 && 
         withdrawAmount.value <= availableBalance.value && 
         selectedAccount.value && 
         !processing.value &&
         !amountError.value;
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
    availableBalance.value = res.data?.balance || 0;
    
    // Mock bank accounts and history
    bankAccounts.value = [
      {
        id: 1,
        bankName: '工商银行',
        accountNumber: '6212261234567890123',
        holderName: '张三'
      },
      {
        id: 2,
        bankName: '建设银行',
        accountNumber: '4367421234567890123',
        holderName: '张三'
      }
    ];

    withdrawHistory.value = [
      {
        id: 1,
        amount: 500,
        bankName: '工商银行',
        accountNumber: '****7890',
        status: 'completed',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
      },
      {
        id: 2,
        amount: 200,
        bankName: '建设银行',
        accountNumber: '****0123',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: 3,
        amount: 300,
        bankName: '工商银行',
        accountNumber: '****7890',
        status: 'rejected',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
      }
    ];

    // Select first account by default
    if (bankAccounts.value.length > 0) {
      selectedAccount.value = bankAccounts.value[0].id;
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
    availableBalance.value = 1580.50;
  }
}

function validateAmount() {
  amountError.value = '';
  
  if (withdrawAmount.value < 50) {
    amountError.value = '最低提现金额为¥50';
  } else if (withdrawAmount.value > availableBalance.value) {
    amountError.value = '提现金额不能超过可用余额';
  }
}

function withdrawAll() {
  withdrawAmount.value = availableBalance.value;
  validateAmount();
}

async function submitWithdraw() {
  if (!canSubmit.value) return;
  
  processing.value = true;
  
  try {
    const account = bankAccounts.value.find(acc => acc.id === selectedAccount.value);
    const withdrawData = {
      amount: withdrawAmount.value,
      accountId: selectedAccount.value,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      holderName: account.holderName,
      serviceFee: serviceFee.value,
      actualReceived: actualReceived.value
    };
    
    await withdraw(withdrawData);
    
    alert(`提现申请已提交！\n提现金额：¥${withdrawAmount.value.toFixed(2)}\n手续费：¥${serviceFee.value.toFixed(2)}\n实际到账：¥${actualReceived.value.toFixed(2)}\n预计1-3个工作日到账`);
    
    // Add to history
    withdrawHistory.value.unshift({
      id: Date.now(),
      amount: withdrawAmount.value,
      bankName: account.bankName,
      accountNumber: '****' + account.accountNumber.slice(-4),
      status: 'pending',
      createdAt: new Date()
    });
    
    // Update balance
    availableBalance.value -= withdrawAmount.value;
    
    // Reset form
    withdrawAmount.value = 0;
    
  } catch (error) {
    alert('提现申请失败，请稍后重试');
    console.error('Withdraw failed:', error);
  } finally {
    processing.value = false;
  }
}

function addBankAccount() {
  if (!newAccount.value.bankName || !newAccount.value.accountNumber || !newAccount.value.holderName) {
    alert('请填写完整的银行账户信息');
    return;
  }
  
  const account = {
    id: Date.now(),
    ...newAccount.value
  };
  
  bankAccounts.value.push(account);
  selectedAccount.value = account.id;
  
  // Reset form
  newAccount.value = {
    bankName: '',
    accountNumber: '',
    holderName: ''
  };
  
  showAddAccount.value = false;
  alert('银行账户添加成功');
}

function formatTime(time) {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
}

function getStatusIcon(status) {
  const icons = {
    completed: '✓',
    pending: '⏳',
    rejected: '✗'
  };
  return icons[status] || '●';
}

function getStatusText(status) {
  const texts = {
    completed: '已完成',
    pending: '审核中',
    rejected: '已拒绝'
  };
  return texts[status] || status;
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.withdraw-page {
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
  margin-bottom: 10px;
}

.balance-note {
  color: #999;
  font-size: 0.9rem;
}

.withdraw-form,
.withdraw-history {
  background: white;
  padding: 25px;
  margin-bottom: 10px;
}

.form-section {
  margin-bottom: 25px;
}

.form-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.amount-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-wrapper {
  position: relative;
  flex: 1;
}

.currency {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
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

.all-btn {
  padding: 15px 20px;
  border: 2px solid #1976d2;
  border-radius: 10px;
  background: transparent;
  color: #1976d2;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.all-btn:hover {
  background: #1976d2;
  color: white;
}

.error-message {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 5px;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 25px;
}

.amount-btn {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 0.9rem;
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

.bank-accounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.bank-account {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bank-account:hover {
  border-color: #1976d2;
}

.bank-account.active {
  border-color: #1976d2;
  background: #f8f9fa;
}

.bank-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.bank-info {
  flex: 1;
}

.bank-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.account-number {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 3px;
}

.account-holder {
  font-size: 0.85rem;
  color: #999;
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

.add-account-btn {
  width: 100%;
  padding: 15px;
  border: 2px dashed #1976d2;
  border-radius: 10px;
  background: transparent;
  color: #1976d2;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-account-btn:hover {
  background: #f8f9fa;
}

.fee-info {
  margin-bottom: 25px;
}

.fee-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.fee-row:last-child {
  border-bottom: none;
}

.fee-row.total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1976d2;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px solid #1976d2;
}

.submit-section {
  text-align: center;
}

.submit-btn {
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
  margin-bottom: 15px;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-note {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.withdraw-history h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
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

.history-icon.completed {
  background: #4caf50;
}

.history-icon.pending {
  background: #ff9800;
}

.history-icon.rejected {
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

.history-bank {
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

.history-status.completed {
  color: #4caf50;
}

.history-status.pending {
  color: #ff9800;
}

.history-status.rejected {
  color: #f44336;
}

.no-history {
  text-align: center;
  padding: 2rem;
  color: #666;
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

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #666;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1976d2;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.confirm-btn {
  background: #1976d2;
  color: white;
}

.confirm-btn:hover {
  background: #1565c0;
}

@media (max-width: 768px) {
  .quick-amounts {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .amount-input {
    flex-direction: column;
  }
  
  .balance-amount {
    font-size: 2rem;
  }
}
</style>