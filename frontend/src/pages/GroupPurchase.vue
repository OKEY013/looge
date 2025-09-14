<template>
  <div class="group-purchase">
    <h2>{{ $t('group') }}</h2>
    <div v-for="zone in zones" :key="zone.id" class="zone-card">
      <h3>{{ zone.name }}</h3>
      <div class="progress-bar">
        <div class="progress" :style="{ width: zone.progress + '%' }"></div>
        <span>{{ zone.progress }}%</span>
      </div>
      <div class="info">
        <span>{{ t('prize') }}：{{ zone.prize }}</span>
        <span>参与人数：{{ zone.participants }}</span>
        <span>剩余时间：{{ zone.timeLeft }}分钟</span>
      </div>
      <button @click="join(zone)">参与拼团</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getGroupList, joinGroup } from '../api/index.js';

const router = useRouter();
const zones = ref([]);


let timer = null;
onMounted(async () => {
  const isLogin = !!window.localStorage.getItem('userToken');
  if (!isLogin) {
    router.push('/login');
    return;
  }
  try {
    const res = await getGroupList();
    zones.value = (res.data || []).map(zone => {
      // 初始化进度和人数
      return {
        ...zone,
        progress: zone.progress || 0,
        participants: zone.participants || Math.floor(10000 + Math.random() * 90000),
        timeLeft: zone.timeLeft || 20
      };
    });
    // 启动进度条和人数定时器
    timer = setInterval(() => {
      zones.value.forEach(zone => {
        if (zone.progress < 100) {
          zone.progress = Math.min(zone.progress + 5, 100);
          zone.timeLeft = Math.max(zone.timeLeft - 1, 0);
        }
        // 每分钟参与人数随机递增5位数
        zone.participants += Math.floor(10000 + Math.random() * 90000);
      });
    }, 60 * 1000);
  } catch (e) {
    zones.value = [];
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

async function join(zone) {
  try {
    await joinGroup({ zoneId: zone.id });
    alert(`已参与${zone.name}`);
  } catch (e) {
    alert('参与失败');
  }
}
</script>

<style scoped>
.group-purchase {
  max-width: 800px;
  margin: 2rem auto;
}
.zone-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: #fafafa;
}
.progress-bar {
  position: relative;
  height: 24px;
  background: #eee;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}
.progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #4caf50;
  border-radius: 12px;
}
.info {
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
}
button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #2196f3;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background: #1976d2;
}
</style>
