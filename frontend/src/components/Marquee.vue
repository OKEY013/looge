<template>
  <div class="marquee">
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const marqueeList = ref([]);
const text = ref('');
async function fetchMarquee() {
  // 假设API返回 [{title, content}]，content为多语言JSON字符串
  const res = await fetch('/api/message/marquee');
  const data = await res.json();
  marqueeList.value = (data.data || []).map(msg => {
    try {
      const content = JSON.parse(msg.content);
      return content[locale.value] || content.zh;
    } catch {
      return msg.content;
    }
  });
  text.value = marqueeList.value.length > 0 ? marqueeList.value[0] : '';
}
onMounted(() => {
  fetchMarquee();
});
</script>

<style scoped>
.marquee {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  background: #fffbe6;
  color: #d48806;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.marquee span {
  display: inline-block;
  animation: marquee 10s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
</style>
