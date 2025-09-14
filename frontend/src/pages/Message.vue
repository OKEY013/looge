<template>
  <div class="message-container">
    <h2>{{ t('message') }}</h2>
    <ul class="message-list">
      <li v-for="msg in messages" :key="msg.id" @click="selectMsg(msg)" :class="{ active: selectedMsg && selectedMsg.id === msg.id }">
        <span class="msg-title">{{ msg.title }}</span>
        <span class="msg-date">{{ msg.date }}</span>
      </li>
    </ul>

    <div v-if="selectedMsg" class="message-detail">
      <h3>{{ selectedMsg.title }}</h3>
      <p>{{ selectedMsg.content }}</p>
      <button @click="selectedMsg = null">{{ t('backToList') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const messages = ref([
  { id: 1, title: '中奖通知', date: '2025-08-28', content: '恭喜您在98USDT区中奖，奖品已发放至您的账户！' },
  { id: 2, title: '系统公告', date: '2025-08-27', content: '拼团区将于本周末维护，请提前参与活动。' },
  { id: 3, title: '活动提醒', date: '2025-08-26', content: '邀请好友注册可获得分红奖励，快去分享吧！' },
])

const selectedMsg = ref(null)

function selectMsg(msg) {
  selectedMsg.value = msg
}
</script>

<style scoped>
.message-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.message-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}
.message-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.message-list li.active {
  background: #e3f2fd;
}
.msg-title { font-weight: bold; }
.msg-date { color: #888; font-size: 0.9em; }
.message-detail {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #2196f3;
  border-radius: 6px;
  background: #f5faff;
}
button { margin-top: 1rem; padding: 0.4rem 1.2rem; border: none; border-radius: 4px; background: #2196f3; color: #fff; cursor: pointer; }
</style>
