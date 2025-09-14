<template>
  <div class="group-purchase">
    <div class="header">
      <h2>{{ $t('group') }}</h2>
      <p class="subtitle">{{ $t('groupSubtitle') || '参与团购，赢取好礼' }}</p>
    </div>
    
    <div class="product-list">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.image || '/api/placeholder/150/150'" :alt="product.name" />
          <div class="participants-badge">{{ product.participants }}人参与</div>
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-price">
            <span class="price">¥{{ product.price }}</span>
            <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
          </div>
          
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress" :style="{ width: product.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ product.progress }}%</span>
          </div>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label">{{ $t('drawTime') || '开奖时间' }}:</span>
              <span class="meta-value">{{ formatDrawTime(product.drawTime) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">{{ $t('timeLeft') || '剩余时间' }}:</span>
              <span class="meta-value">{{ product.timeLeft }}分钟</span>
            </div>
          </div>
          
          <button @click="join(product)" class="join-btn" :disabled="product.progress >= 100">
            {{ product.progress >= 100 ? $t('soldOut') || '已售罄' : $t('joinGroup') || '参与团购' }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!products.length" class="empty-state">
      <p>{{ $t('noProducts') || '暂无可参与的团购产品' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getGroupList, joinGroup } from '../api/index.js';

const router = useRouter();
const { t } = useI18n();
const products = ref([]);

let timer = null;

onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  await loadProducts();
  startTimer();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

async function loadProducts() {
  try {
    const res = await getGroupList();
    products.value = (res.data || []).map(product => ({
      ...product,
      progress: product.progress || Math.floor(Math.random() * 80) + 10,
      participants: product.participants || Math.floor(10000 + Math.random() * 90000),
      timeLeft: product.timeLeft || Math.floor(Math.random() * 120) + 30,
      price: product.price || Math.floor(Math.random() * 500) + 50,
      originalPrice: product.originalPrice || Math.floor(Math.random() * 200) + 100,
      drawTime: product.drawTime || new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      image: product.image || `/api/placeholder/150/150`,
      name: product.name || `精美商品 ${product.id}`
    }));
  } catch (e) {
    console.error('Failed to load products:', e);
    products.value = [];
  }
}

function startTimer() {
  timer = setInterval(() => {
    products.value.forEach(product => {
      if (product.progress < 100) {
        product.progress = Math.min(product.progress + Math.random() * 2, 100);
        product.timeLeft = Math.max(product.timeLeft - 1, 0);
      }
      // 随机增加参与人数
      if (Math.random() > 0.7) {
        product.participants += Math.floor(Math.random() * 10) + 1;
      }
    });
  }, 60 * 1000);
}

function formatDrawTime(time) {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
}

async function join(product) {
  try {
    await joinGroup({ productId: product.id });
    alert(`已参与${product.name}团购`);
    await loadProducts(); // 重新加载数据
  } catch (e) {
    alert('参与失败，请稍后重试');
  }
}
</script>

<style scoped>
.group-purchase {
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

.product-list {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(25, 118, 210, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(45deg, #f5f5f5, #e8e8e8);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.participants-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(25, 118, 210, 0.9);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.product-price {
  margin-bottom: 15px;
}

.price {
  font-size: 1.4rem;
  color: #e53935;
  font-weight: 700;
  margin-right: 10px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 1rem;
}

.progress-section {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 10px;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  border-radius: 4px;
  transition: width 1s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.product-meta {
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.meta-label {
  color: #666;
}

.meta-value {
  color: #333;
  font-weight: 500;
}

.join-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
}

.join-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .product-list {
    grid-template-columns: 1fr;
    padding: 0 10px;
  }
  
  .header h2 {
    font-size: 1.5rem;
  }
  
  .product-card {
    margin-bottom: 15px;
  }
}
</style>
