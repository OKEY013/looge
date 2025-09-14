<template>
  <div class="my-prizes-page">
    <div class="header">
      <h2>{{ $t('myPrizes') || '我的奖品' }}</h2>
      <p class="subtitle">{{ $t('myPrizesSubtitle') || '管理您的中奖物品' }}</p>
    </div>

    <!-- Prize Statistics -->
    <div class="prize-stats">
      <div class="stat-card">
        <div class="stat-number">{{ totalPrizes }}</div>
        <div class="stat-label">{{ $t('totalPrizes') || '总奖品数' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ pendingPrizes }}</div>
        <div class="stat-label">{{ $t('pendingPrizes') || '待处理' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ deliveredPrizes }}</div>
        <div class="stat-label">{{ $t('deliveredPrizes') || '已发货' }}</div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        v-for="status in statusFilters" 
        :key="status.value"
        @click="activeFilter = status.value"
        :class="['tab-btn', { active: activeFilter === status.value }]"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Prize List -->
    <div class="prize-list">
      <div 
        v-for="prize in filteredPrizes" 
        :key="prize.id" 
        class="prize-card"
        @click="showPrizeDetails(prize)"
      >
        <div class="prize-image">
          <img :src="prize.image || '/api/placeholder/100/100'" :alt="prize.name" />
          <div class="prize-status" :class="prize.status">
            {{ getStatusText(prize.status) }}
          </div>
        </div>
        
        <div class="prize-info">
          <h3 class="prize-name">{{ prize.name }}</h3>
          <div class="prize-details">
            <div class="detail-item">
              <span class="detail-label">{{ $t('winTime') || '中奖时间' }}:</span>
              <span class="detail-value">{{ formatTime(prize.winTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ $t('prizeValue') || '奖品价值' }}:</span>
              <span class="detail-value">¥{{ prize.value }}</span>
            </div>
            <div class="detail-item" v-if="prize.trackingNumber">
              <span class="detail-label">{{ $t('trackingNumber') || '快递单号' }}:</span>
              <span class="detail-value">{{ prize.trackingNumber }}</span>
            </div>
          </div>
        </div>

        <div class="prize-actions">
          <button 
            v-if="prize.status === 'pending'" 
            @click.stop="chooseDelivery(prize)"
            class="action-btn delivery-btn"
          >
            {{ $t('chooseDelivery') || '选择邮寄' }}
          </button>
          <button 
            v-if="prize.status === 'pending'" 
            @click.stop="recyclePrize(prize)"
            class="action-btn recycle-btn"
          >
            {{ $t('recyclePrize') || '回收奖品' }}
          </button>
          <button 
            v-if="prize.status === 'delivered'" 
            @click.stop="trackDelivery(prize)"
            class="action-btn track-btn"
          >
            {{ $t('trackDelivery') || '查看物流' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!filteredPrizes.length" class="empty-state">
      <div class="empty-icon">🏆</div>
      <p>{{ $t('noPrizes') || '暂无奖品记录' }}</p>
      <button @click="goToGroupPurchase" class="goto-group-btn">
        {{ $t('goToGroup') || '去参与团购' }}
      </button>
    </div>

    <!-- Prize Detail Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedPrize?.name }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <img :src="selectedPrize?.image || '/api/placeholder/200/200'" :alt="selectedPrize?.name" />
          <div class="prize-description">
            <p>{{ selectedPrize?.description || '精美奖品，恭喜您中奖！' }}</p>
          </div>
          <div class="prize-meta">
            <div class="meta-row">
              <span>{{ $t('winTime') || '中奖时间' }}:</span>
              <span>{{ formatTime(selectedPrize?.winTime) }}</span>
            </div>
            <div class="meta-row">
              <span>{{ $t('prizeValue') || '奖品价值' }}:</span>
              <span>¥{{ selectedPrize?.value }}</span>
            </div>
            <div class="meta-row">
              <span>{{ $t('status') || '状态' }}:</span>
              <span>{{ getStatusText(selectedPrize?.status) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button 
            v-if="selectedPrize?.status === 'pending'" 
            @click="chooseDelivery(selectedPrize)"
            class="modal-btn delivery-btn"
          >
            {{ $t('chooseDelivery') || '选择邮寄' }}
          </button>
          <button 
            v-if="selectedPrize?.status === 'pending'" 
            @click="recyclePrize(selectedPrize)"
            class="modal-btn recycle-btn"
          >
            {{ $t('recyclePrize') || '回收奖品' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const prizes = ref([]);
const activeFilter = ref('all');
const showModal = ref(false);
const selectedPrize = ref(null);

const statusFilters = [
  { value: 'all', label: t('all') || '全部' },
  { value: 'pending', label: t('pending') || '待处理' },
  { value: 'delivered', label: t('delivered') || '已发货' },
  { value: 'recycled', label: t('recycled') || '已回收' }
];

const totalPrizes = computed(() => prizes.value.length);
const pendingPrizes = computed(() => prizes.value.filter(p => p.status === 'pending').length);
const deliveredPrizes = computed(() => prizes.value.filter(p => p.status === 'delivered').length);

const filteredPrizes = computed(() => {
  if (activeFilter.value === 'all') {
    return prizes.value;
  }
  return prizes.value.filter(prize => prize.status === activeFilter.value);
});

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadPrizes();
});

async function loadPrizes() {
  try {
    // Mock API call - replace with actual API
    // const res = await getPrizes();
    // prizes.value = res.data || [];
    
    // Mock data for demo
    prizes.value = [
      {
        id: 1,
        name: '苹果 iPhone 15 Pro',
        image: '/api/placeholder/100/100',
        value: 8999,
        status: 'pending',
        winTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        description: '最新款苹果手机，256GB存储，深空黑色'
      },
      {
        id: 2,
        name: '戴森吸尘器 V15',
        image: '/api/placeholder/100/100',
        value: 3990,
        status: 'delivered',
        winTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        trackingNumber: 'SF1234567890',
        description: '高性能无线吸尘器，激光探测微尘技术'
      },
      {
        id: 3,
        name: '华为 MatePad Pro',
        image: '/api/placeholder/100/100',
        value: 4999,
        status: 'recycled',
        winTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        description: '12.6英寸2K全面屏平板电脑'
      }
    ];
  } catch (error) {
    console.error('Failed to load prizes:', error);
    prizes.value = [];
  }
}

function formatTime(time) {
  if (!time) return '';
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusText(status) {
  const statusMap = {
    pending: '待处理',
    delivered: '已发货',
    recycled: '已回收'
  };
  return statusMap[status] || status;
}

function showPrizeDetails(prize) {
  selectedPrize.value = prize;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedPrize.value = null;
}

function chooseDelivery(prize) {
  // Navigate to delivery address form
  router.push(`/delivery-address/${prize.id}`);
}

function recyclePrize(prize) {
  if (confirm('确定要回收这个奖品吗？回收后将获得对应现金奖励。')) {
    // API call to recycle prize
    prize.status = 'recycled';
    alert('奖品回收成功！现金奖励已发放到您的账户。');
  }
}

function trackDelivery(prize) {
  if (prize.trackingNumber) {
    // Open tracking page or external tracking URL
    alert(`快递单号：${prize.trackingNumber}\n请前往对应快递公司官网查询物流信息`);
  }
}

function goToGroupPurchase() {
  router.push('/group');
}
</script>

<style scoped>
.my-prizes-page {
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

.prize-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.filter-tabs {
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
}

.tab-btn.active {
  background: #1976d2;
  color: white;
}

.prize-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.prize-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid rgba(25, 118, 210, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.prize-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.prize-image {
  position: relative;
  flex-shrink: 0;
}

.prize-image img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.prize-status {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  color: white;
  font-weight: 500;
}

.prize-status.pending {
  background: #ff9800;
}

.prize-status.delivered {
  background: #4caf50;
}

.prize-status.recycled {
  background: #9e9e9e;
}

.prize-info {
  flex: 1;
}

.prize-name {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.prize-details {
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

.prize-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.delivery-btn {
  background: #4caf50;
  color: white;
}

.delivery-btn:hover {
  background: #45a049;
}

.recycle-btn {
  background: #ff9800;
  color: white;
}

.recycle-btn:hover {
  background: #f57c00;
}

.track-btn {
  background: #1976d2;
  color: white;
}

.track-btn:hover {
  background: #1565c0;
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

.goto-group-btn {
  margin-top: 20px;
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  background: #1976d2;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.goto-group-btn:hover {
  background: #1565c0;
  transform: translateY(-2px);
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

.modal-body img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
}

.prize-description {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.prize-meta {
  margin-bottom: 20px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.meta-row span:first-child {
  color: #666;
}

.meta-row span:last-child {
  font-weight: 500;
  color: #333;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .my-prizes-page {
    padding: 15px;
  }
  
  .prize-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .prize-card {
    flex-direction: column;
    text-align: center;
  }
  
  .prize-actions {
    flex-direction: row;
    width: 100%;
  }
  
  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
}
</style>