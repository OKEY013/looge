<template>
  <div class="profile-page">
    <div class="header">
      <h2>{{ t('profile') }}</h2>
      <div class="language-switch">
        <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>

    <!-- User Avatar & Basic Info -->
    <div class="user-card">
      <div class="user-avatar">
        <img :src="user.avatar || '/api/placeholder/80/80'" :alt="user.nickname" />
        <button @click="editProfile" class="edit-avatar-btn">📷</button>
      </div>
      <div class="user-basic-info">
        <h3 class="user-name">{{ user.nickname || '用户' }}</h3>
        <div class="user-vip-status" :class="{ vip: user.isVip }">
          {{ user.isVip ? t('vipMember') || 'VIP会员' : t('normalUser') || '普通用户' }}
        </div>
      </div>
      <button v-if="!user.isVip" @click="goToVip" class="upgrade-vip-btn">
        {{ t('upgradeVip') || '升级VIP' }}
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-item" @click="goToWallet">
        <div class="stat-value">¥{{ user.balance?.toFixed(2) || '0.00' }}</div>
        <div class="stat-label">{{ t('balance') }}</div>
      </div>
      <div class="stat-item" @click="goToTeam">
        <div class="stat-value">{{ user.teamCount || 0 }}</div>
        <div class="stat-label">{{ t('teamCount') }}</div>
      </div>
      <div class="stat-item" @click="goToMyPrizes">
        <div class="stat-value">{{ userPrizes || 0 }}</div>
        <div class="stat-label">{{ t('prizeCount') || '奖品数' }}</div>
      </div>
    </div>

    <!-- Invite Section -->
    <div class="invite-section">
      <h3>{{ t('inviteShare') || '邀请分享' }}</h3>
      <div class="invite-card">
        <div class="invite-info">
          <div class="invite-code">
            <span class="label">{{ t('inviteCode') }}:</span>
            <span class="code">{{ user.inviteCode || 'ABC123' }}</span>
            <button @click="copyInviteCode" class="copy-btn">{{ t('copy') || '复制' }}</button>
          </div>
          <div class="invite-count">
            <span>{{ t('inviteCount') }}: {{ user.inviteCount || 0 }}</span>
          </div>
        </div>
        <button @click="shareInvite" class="share-btn">
          {{ t('shareLink') || '分享链接' }}
        </button>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="menu-section">
      <div class="menu-item" @click="goToWallet">
        <div class="menu-icon">💰</div>
        <div class="menu-content">
          <div class="menu-title">{{ t('wallet') }}</div>
          <div class="menu-desc">{{ t('walletDesc') || '账户余额、充值提现' }}</div>
        </div>
        <div class="menu-arrow">></div>
      </div>

      <div class="menu-item" @click="goToMyPrizes">
        <div class="menu-icon">🏆</div>
        <div class="menu-content">
          <div class="menu-title">{{ t('myPrizes') || '我的奖品' }}</div>
          <div class="menu-desc">{{ t('prizesDesc') || '查看中奖记录' }}</div>
        </div>
        <div class="menu-arrow">></div>
      </div>

      <div class="menu-item" @click="goToTeam">
        <div class="menu-icon">👥</div>
        <div class="menu-content">
          <div class="menu-title">{{ t('team') || '我的团队' }}</div>
          <div class="menu-desc">{{ t('teamDesc') || '团队成员管理' }}</div>
        </div>
        <div class="menu-arrow">></div>
      </div>

      <div class="menu-item" @click="goToTransactionHistory">
        <div class="menu-icon">📊</div>
        <div class="menu-content">
          <div class="menu-title">{{ t('transactionHistory') || '交易记录' }}</div>
          <div class="menu-desc">{{ t('transactionDesc') || '资金流水记录' }}</div>
        </div>
        <div class="menu-arrow">></div>
      </div>

      <div class="menu-item" @click="editProfile">
        <div class="menu-icon">⚙️</div>
        <div class="menu-content">
          <div class="menu-title">{{ t('settings') || '设置' }}</div>
          <div class="menu-desc">{{ t('settingsDesc') || '个人信息设置' }}</div>
        </div>
        <div class="menu-arrow">></div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button @click="goToRecharge" class="action-btn recharge-btn">
        {{ t('recharge') }}
      </button>
      <button @click="goToWithdraw" class="action-btn withdraw-btn">
        {{ t('withdraw') }}
      </button>
    </div>

    <div class="logout-section">
      <button @click="logout" class="logout-btn">
        {{ t('logout') || '退出登录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProfile } from '../api/index.js';

const { t, locale } = useI18n();
const router = useRouter();

const user = ref({ 
  nickname: '', 
  inviteCode: '', 
  inviteCount: 0, 
  teamCount: 0, 
  balance: 0, 
  isVip: false,
  avatar: ''
});

const currentLocale = ref(locale.value);
const userPrizes = ref(3); // Mock prize count

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadProfile();
});

async function loadProfile() {
  try {
    const res = await getProfile();
    Object.assign(user.value, res.data || {});
  } catch (e) {
    // Mock data for demo
    user.value = {
      nickname: 'Demo用户',
      inviteCode: 'ABC123',
      inviteCount: 15,
      teamCount: 42,
      balance: 1580.50,
      isVip: false,
      avatar: '/api/placeholder/80/80'
    };
  }
}

function changeLanguage() {
  locale.value = currentLocale.value;
  localStorage.setItem('language', currentLocale.value);
}

function copyInviteCode() {
  const code = user.value.inviteCode || 'ABC123';
  navigator.clipboard.writeText(code).then(() => {
    alert(t('copySuccess') || '复制成功');
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(t('copySuccess') || '复制成功');
  });
}

function shareInvite() {
  const inviteLink = `${window.location.origin}/register?invite=${user.value.inviteCode || 'ABC123'}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Looge团购邀请',
      text: '邀请您加入Looge团购平台，一起参与抽奖赢大奖！',
      url: inviteLink
    });
  } else {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert(t('shareLinkCopied') || '邀请链接已复制到剪贴板');
    });
  }
}

function goToVip() {
  router.push('/vip');
}

function goToWallet() {
  router.push('/wallet');
}

function goToMyPrizes() {
  router.push('/my-prizes');
}

function goToTeam() {
  router.push('/team');
}

function goToTransactionHistory() {
  router.push('/transaction-history');
}

function goToRecharge() {
  router.push('/recharge');
}

function goToWithdraw() {
  router.push('/withdraw');
}

function editProfile() {
  router.push('/edit-profile');
}

function logout() {
  if (confirm(t('confirmLogout') || '确定要退出登录吗？')) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    router.push('/login');
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 50%, #bbdefb 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: #1976d2;
  font-size: 2rem;
  margin: 0;
}

.language-switch {
  display: flex;
  align-items: center;
}

.lang-select {
  padding: 8px 12px;
  border: 2px solid #1976d2;
  border-radius: 20px;
  background: white;
  color: #1976d2;
  cursor: pointer;
  outline: none;
}

.user-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e3f2fd;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #1976d2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-basic-info {
  flex: 1;
}

.user-name {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 8px 0;
}

.user-vip-status {
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #f5f5f5;
  color: #666;
  display: inline-block;
}

.user-vip-status.vip {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.upgrade-vip-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upgrade-vip-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-item {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.invite-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.invite-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.invite-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
  padding: 20px;
}

.invite-info {
  margin-bottom: 15px;
}

.invite-code {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.label {
  color: #666;
  font-size: 0.9rem;
}

.code {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1976d2;
  background: white;
  padding: 5px 10px;
  border-radius: 5px;
}

.copy-btn {
  padding: 5px 12px;
  border: 1px solid #1976d2;
  border-radius: 15px;
  background: transparent;
  color: #1976d2;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #1976d2;
  color: white;
}

.invite-count {
  color: #666;
  font-size: 0.9rem;
}

.share-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #1976d2;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.share-btn:hover {
  background: #1565c0;
}

.menu-section {
  background: white;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.menu-desc {
  font-size: 0.85rem;
  color: #666;
}

.menu-arrow {
  font-size: 1.2rem;
  color: #ccc;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.action-btn {
  flex: 1;
  padding: 15px;
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

.logout-section {
  text-align: center;
}

.logout-btn {
  padding: 12px 30px;
  border: 2px solid #f44336;
  border-radius: 25px;
  background: transparent;
  color: #f44336;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #f44336;
  color: white;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }
  
  .user-card {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .stat-item {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
