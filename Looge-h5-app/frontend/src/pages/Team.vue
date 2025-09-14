<template>
  <div class="team-page">
    <div class="header">
      <h2>{{ $t('team') || '我的团队' }}</h2>
      <p class="subtitle">{{ $t('teamSubtitle') || '管理您的团队成员和收益' }}</p>
    </div>

    <!-- Team Overview -->
    <div class="team-overview">
      <div class="overview-card">
        <div class="overview-icon">👥</div>
        <div class="overview-content">
          <div class="overview-number">{{ totalMembers }}</div>
          <div class="overview-label">{{ $t('totalMembers') || '团队总人数' }}</div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="overview-icon">💰</div>
        <div class="overview-content">
          <div class="overview-number">¥{{ totalCommission.toFixed(2) }}</div>
          <div class="overview-label">{{ $t('totalCommission') || '累计佣金' }}</div>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="overview-icon">📈</div>
        <div class="overview-content">
          <div class="overview-number">¥{{ todayCommission.toFixed(2) }}</div>
          <div class="overview-label">{{ $t('todayCommission') || '今日收益' }}</div>
        </div>
      </div>
    </div>

    <!-- Commission Rate Info -->
    <div class="commission-info">
      <h3>{{ $t('commissionRates') || '返利比例' }}</h3>
      <div class="rate-cards">
        <div class="rate-card">
          <div class="rate-level">M1</div>
          <div class="rate-percentage">8%</div>
          <div class="rate-desc">{{ $t('directReferral') || '直接推荐' }}</div>
        </div>
        <div class="rate-card">
          <div class="rate-level">M2</div>
          <div class="rate-percentage">3%</div>
          <div class="rate-desc">{{ $t('secondLevel') || '二级推荐' }}</div>
        </div>
        <div class="rate-card">
          <div class="rate-level">M3</div>
          <div class="rate-percentage">1%</div>
          <div class="rate-desc">{{ $t('thirdLevel') || '三级推荐' }}</div>
        </div>
      </div>
    </div>

    <!-- Level Tabs -->
    <div class="level-tabs">
      <button 
        v-for="level in levels" 
        :key="level.value"
        @click="activeLevel = level.value"
        :class="['tab-btn', { active: activeLevel === level.value }]"
      >
        {{ level.label }}
        <span class="member-count">({{ getMemberCount(level.value) }})</span>
      </button>
    </div>

    <!-- Member List -->
    <div class="member-list">
      <div 
        v-for="member in filteredMembers" 
        :key="member.id" 
        class="member-card"
      >
        <div class="member-avatar">
          <img :src="member.avatar || '/api/placeholder/50/50'" :alt="member.nickname" />
          <div class="member-level" :class="`level-${member.level}`">
            {{ member.level.toUpperCase() }}
          </div>
        </div>
        
        <div class="member-info">
          <div class="member-name">{{ member.nickname }}</div>
          <div class="member-details">
            <div class="detail-item">
              <span class="detail-label">{{ $t('joinTime') || '加入时间' }}:</span>
              <span class="detail-value">{{ formatTime(member.joinTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('totalContribution') || '累计贡献' }}:</span>
              <span class="detail-value">¥{{ member.totalContribution.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('monthlyContribution') || '本月贡献' }}:</span>
              <span class="detail-value">¥{{ member.monthlyContribution.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="member-stats">
          <div class="stat-item">
            <div class="stat-value">{{ member.subordinates || 0 }}</div>
            <div class="stat-label">{{ $t('subordinates') || '下级' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ member.purchases || 0 }}</div>
            <div class="stat-label">{{ $t('purchases') || '购买次数' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredMembers.length" class="empty-state">
      <div class="empty-icon">👥</div>
      <p>{{ $t('noMembers') || '暂无团队成员' }}</p>
      <button @click="goToShare" class="invite-btn">
        {{ $t('inviteMembers') || '邀请成员' }}
      </button>
    </div>

    <!-- Commission History -->
    <div class="commission-history">
      <h3>{{ $t('recentCommissions') || '最近收益记录' }}</h3>
      <div class="commission-list">
        <div 
          v-for="commission in recentCommissions" 
          :key="commission.id" 
          class="commission-item"
        >
          <div class="commission-icon" :class="`level-${commission.fromLevel}`">
            {{ commission.fromLevel.toUpperCase() }}
          </div>
          <div class="commission-details">
            <div class="commission-source">来自: {{ commission.fromUser }}</div>
            <div class="commission-reason">{{ commission.reason }}</div>
            <div class="commission-time">{{ formatTime(commission.time) }}</div>
          </div>
          <div class="commission-amount">
            +¥{{ commission.amount.toFixed(2) }}
          </div>
        </div>
      </div>
      <button @click="goToCommissionHistory" class="view-all-btn">
        {{ $t('viewAllCommissions') || '查看全部收益' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getTeamInfo } from '../api/index.js';

const router = useRouter();
const { t } = useI18n();

const members = ref([]);
const recentCommissions = ref([]);
const activeLevel = ref('all');

const levels = [
  { value: 'all', label: t('all') || '全部' },
  { value: 'm1', label: 'M1级' },
  { value: 'm2', label: 'M2级' },
  { value: 'm3', label: 'M3级' }
];

const totalMembers = computed(() => members.value.length);
const totalCommission = computed(() => {
  return recentCommissions.value.reduce((sum, item) => sum + item.amount, 0);
});
const todayCommission = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return recentCommissions.value
    .filter(item => new Date(item.time) >= today)
    .reduce((sum, item) => sum + item.amount, 0);
});

const filteredMembers = computed(() => {
  if (activeLevel.value === 'all') {
    return members.value;
  }
  return members.value.filter(member => member.level === activeLevel.value);
});

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadTeamData();
});

async function loadTeamData() {
  try {
    // Mock API call - replace with actual API
    // const res = await getTeamInfo();
    // members.value = res.data?.members || [];
    // recentCommissions.value = res.data?.commissions || [];
    
    // Mock data for demo
    members.value = [
      {
        id: 1,
        nickname: '用户001',
        avatar: '/api/placeholder/50/50',
        level: 'm1',
        joinTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        totalContribution: 1250.80,
        monthlyContribution: 320.50,
        subordinates: 3,
        purchases: 15
      },
      {
        id: 2,
        nickname: '用户002',
        avatar: '/api/placeholder/50/50',
        level: 'm1',
        joinTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
        totalContribution: 890.30,
        monthlyContribution: 180.20,
        subordinates: 1,
        purchases: 8
      },
      {
        id: 3,
        nickname: '用户003',
        avatar: '/api/placeholder/50/50',
        level: 'm2',
        joinTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
        totalContribution: 540.60,
        monthlyContribution: 95.30,
        subordinates: 0,
        purchases: 12
      },
      {
        id: 4,
        nickname: '用户004',
        avatar: '/api/placeholder/50/50',
        level: 'm2',
        joinTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        totalContribution: 330.20,
        monthlyContribution: 45.80,
        subordinates: 2,
        purchases: 5
      },
      {
        id: 5,
        nickname: '用户005',
        avatar: '/api/placeholder/50/50',
        level: 'm3',
        joinTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        totalContribution: 125.50,
        monthlyContribution: 25.10,
        subordinates: 0,
        purchases: 3
      }
    ];

    recentCommissions.value = [
      {
        id: 1,
        fromUser: '用户001',
        fromLevel: 'm1',
        reason: '购买商品获得返利',
        amount: 25.60,
        time: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: 2,
        fromUser: '用户003',
        fromLevel: 'm2',
        reason: '团购参与返利',
        amount: 12.30,
        time: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: 3,
        fromUser: '用户002',
        fromLevel: 'm1',
        reason: '充值返利',
        amount: 40.00,
        time: new Date(Date.now() - 1000 * 60 * 60 * 5)
      },
      {
        id: 4,
        fromUser: '用户005',
        fromLevel: 'm3',
        reason: '新用户注册返利',
        amount: 8.80,
        time: new Date(Date.now() - 1000 * 60 * 60 * 12)
      }
    ];
  } catch (error) {
    console.error('Failed to load team data:', error);
    members.value = [];
    recentCommissions.value = [];
  }
}

function getMemberCount(level) {
  if (level === 'all') return members.value.length;
  return members.value.filter(member => member.level === level).length;
}

function formatTime(time) {
  if (!time) return '';
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours}小时前` : '刚刚';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString();
  }
}

function goToShare() {
  router.push('/share');
}

function goToCommissionHistory() {
  router.push('/transaction-history?type=commission');
}
</script>

<style scoped>
.team-page {
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

.team-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.overview-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.overview-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview-content {
  flex: 1;
}

.overview-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 5px;
}

.overview-label {
  font-size: 0.85rem;
  color: #666;
}

.commission-info {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.commission-info h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.rate-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.rate-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.rate-card:hover {
  border-color: #1976d2;
  transform: translateY(-2px);
}

.rate-level {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 10px;
}

.rate-percentage {
  font-size: 2rem;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 10px;
}

.rate-desc {
  font-size: 0.9rem;
  color: #666;
}

.level-tabs {
  display: flex;
  background: white;
  border-radius: 25px;
  padding: 5px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.tab-btn {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.tab-btn.active {
  background: #1976d2;
  color: white;
}

.member-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.member-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
  transition: all 0.3s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.member-avatar {
  position: relative;
  flex-shrink: 0;
}

.member-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.member-level {
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  color: white;
  font-weight: 600;
}

.level-m1 {
  background: #4caf50;
}

.level-m2 {
  background: #ff9800;
}

.level-m3 {
  background: #9e9e9e;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item {
  display: flex;
  font-size: 0.85rem;
}

.detail-label {
  color: #666;
  margin-right: 10px;
  min-width: 80px;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

.member-stats {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1976d2;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
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

.invite-btn {
  margin-top: 20px;
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  background: #1976d2;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.invite-btn:hover {
  background: #1565c0;
  transform: translateY(-2px);
}

.commission-history {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.commission-history h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.commission-list {
  margin-bottom: 20px;
}

.commission-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.commission-item:hover {
  background: #e3f2fd;
}

.commission-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.commission-details {
  flex: 1;
}

.commission-source {
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
}

.commission-reason {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 3px;
}

.commission-time {
  font-size: 0.8rem;
  color: #999;
}

.commission-amount {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4caf50;
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
  .team-page {
    padding: 15px;
  }
  
  .team-overview {
    grid-template-columns: 1fr;
  }
  
  .rate-cards {
    grid-template-columns: 1fr;
  }
  
  .member-card {
    flex-direction: column;
    text-align: center;
  }
  
  .member-stats {
    justify-content: center;
    width: 100%;
  }
  
  .overview-card {
    justify-content: center;
  }
}
</style>