<template>
  <div class="group-purchase">
    <div class="header">
      <button @click="goBack" class="back-btn">← {{ $t('back') || '返回' }}</button>
      <h2>{{ $t('group') || '拼团区' }}</h2>
      <div class="language-switcher">
        <select v-model="currentLang" @change="changeLanguage">
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>

    <div class="zones-container">
      <div v-for="zone in zones" :key="zone.id" class="zone-card">
        <div class="zone-header">
          <h3>{{ zone.name }}</h3>
          <span class="zone-amount">¥{{ zone.amount.toLocaleString() }}</span>
        </div>
        
        <div class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: zone.progress + '%' }"></div>
            <span class="progress-text">{{ zone.progress }}%</span>
          </div>
        </div>
        
        <div class="zone-info">
          <div class="info-item">
            <span class="info-label">🎁 {{ $t('prize') || '奖品' }}:</span>
            <span class="info-value">{{ zone.prize }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">👥 {{ $t('participants') || '参与人数' }}:</span>
            <span class="info-value">{{ zone.participants }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">⏰ {{ $t('timeLeft') || '剩余时间' }}:</span>
            <span class="info-value">{{ zone.timeLeft }} {{ $t('minutes') || '分钟' }}</span>
          </div>
        </div>
        
        <button @click="join(zone)" class="join-btn" :disabled="zone.timeLeft <= 0">
          {{ zone.timeLeft <= 0 ? '已结束' : ($t('joinGroup') || '参与拼团') }}
        </button>
      </div>
    </div>

    <!-- VIP Notice -->
    <div v-if="!isVip" class="vip-notice">
      <div class="vip-content">
        <h4>🌟 升级VIP会员</h4>
        <p>VIP用户可获得分红权益，享受更多特权！</p>
        <button @click="goToVip" class="vip-btn">立即升级</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const zones = ref([]);
const currentLang = ref('zh');
const isVip = ref(false);

// Define the 7 required zones according to requirements
const initializeZones = () => {
  zones.value = [
    {
      id: 1,
      name: '10000区',
      amount: 10000,
      prize: 'iPhone 15 Pro',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(10000 + Math.random() * 90000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    },
    {
      id: 2,
      name: '30000区',
      amount: 30000,
      prize: 'MacBook Air M2',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(15000 + Math.random() * 85000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    },
    {
      id: 3,
      name: '80000区',
      amount: 80000,
      prize: 'Tesla Model 3 配件包',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(20000 + Math.random() * 80000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    },
    {
      id: 4,
      name: '150000区',
      amount: 150000,
      prize: '劳力士手表',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(25000 + Math.random() * 75000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    },
    {
      id: 5,
      name: '300000区',
      amount: 300000,
      prize: '奔驰C级轿车首付',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(30000 + Math.random() * 70000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    },
    {
      id: 6,
      name: '600000区',
      amount: 600000,
      prize: 'BMW X5 首付',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(35000 + Math.random() * 65000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    },
    {
      id: 7,
      name: '1000000区',
      amount: 1000000,
      prize: '海景别墅首付',
      progress: Math.floor(Math.random() * 80) + 10,
      participants: Math.floor(40000 + Math.random() * 60000),
      timeLeft: Math.floor(Math.random() * 55) + 5
    }
  ];
};

let timer = null;

const startProgressTimer = () => {
  // Update progress every minute (5% increment as per requirements)
  timer = setInterval(() => {
    zones.value.forEach(zone => {
      if (zone.timeLeft > 0) {
        zone.timeLeft--;
        // Increase progress by 5% every minute as per requirements
        if (zone.progress < 100) {
          zone.progress = Math.min(100, zone.progress + 5);
        }
        // Simulate participants increase
        zone.participants += Math.floor(Math.random() * 100) + 50;
        
        // When reaches 100%, simulate lottery draw
        if (zone.progress >= 100 || zone.timeLeft <= 0) {
          zone.timeLeft = 0;
          // Reset after 60 minutes as per requirements
          setTimeout(() => {
            zone.progress = Math.floor(Math.random() * 20) + 5;
            zone.timeLeft = 60;
            zone.participants = Math.floor(10000 + Math.random() * 90000);
          }, 2000);
        }
      }
    });
  }, 60000); // Real: 60 seconds, Demo: 10 seconds for quick testing
};

const changeLanguage = () => {
  localStorage.setItem('language', currentLang.value);
  window.location.reload();
};

const join = (zone) => {
  const isLogin = !!localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  
  if (zone.timeLeft <= 0) {
    alert('该拼团已结束，请等待下轮开始');
    return;
  }
  
  // Simulate joining the group
  alert(`成功参与 ${zone.name} 拼团！\n奖品：${zone.prize}\n当前进度：${zone.progress}%`);
};

const goBack = () => {
  router.push('/');
};

const goToVip = () => {
  router.push('/vip');
};

onMounted(() => {
  initializeZones();
  startProgressTimer();
  
  // Check VIP status
  isVip.value = localStorage.getItem('isVip') === 'true';
  
  // Get saved language
  currentLang.value = localStorage.getItem('language') || 'zh';
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.group-purchase {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #87ceeb 50%, #87ceeb 100%);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(135, 206, 235, 0.2);
}

.back-btn {
  background: transparent;
  border: 2px solid #87ceeb;
  color: #2c5282;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(135, 206, 235, 0.1);
  transform: translateX(-3px);
}

.header h2 {
  color: #2c5282;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(135, 206, 235, 0.3);
}

.language-switcher select {
  padding: 8px 12px;
  border: 2px solid #87ceeb;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 500;
  cursor: pointer;
}

.zones-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.zone-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(135, 206, 235, 0.3);
  border: 2px solid rgba(135, 206, 235, 0.2);
  transition: all 0.3s ease;
}

.zone-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(135, 206, 235, 0.4);
  border-color: #87ceeb;
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.zone-header h3 {
  color: #2c5282;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 700;
}

.zone-amount {
  background: linear-gradient(135deg, #87ceeb, #4a90e2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 3px 10px rgba(135, 206, 235, 0.4);
}

.progress-section {
  margin-bottom: 20px;
}

.progress-bar {
  background: rgba(135, 206, 235, 0.2);
  border-radius: 25px;
  height: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  background: linear-gradient(90deg, #87ceeb, #4a90e2);
  height: 100%;
  border-radius: 25px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #2c5282;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.zone-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 0;
}

.info-label {
  color: #4a5568;
  font-weight: 500;
}

.info-value {
  color: #2c5282;
  font-weight: 600;
}

.join-btn {
  width: 100%;
  background: linear-gradient(135deg, #87ceeb, #4a90e2);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(135, 206, 235, 0.4);
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(135, 206, 235, 0.6);
}

.join-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  box-shadow: none;
}

.vip-notice {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.vip-content h4 {
  color: #8b4513;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.vip-content p {
  color: #8b4513;
  margin-bottom: 15px;
  opacity: 0.9;
}

.vip-btn {
  background: linear-gradient(135deg, #8b4513, #cd853f);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
}

.vip-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
}

@media (max-width: 768px) {
  .zones-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header h2 {
    font-size: 1.5rem;
  }
  
  .zone-card {
    padding: 20px;
  }
  
  .zone-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
