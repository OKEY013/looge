<template>
  <div class="carousel">
    <div class="carousel-wrapper">
      <div v-for="(img, idx) in images" :key="idx" class="carousel-item" :class="{active: idx === current}">
        <img :src="img.src" :alt="img.alt" @click="goToProduct(img.link)" />
      </div>
    </div>
    <div class="carousel-indicators">
      <span v-for="(img, idx) in images" :key="idx" :class="{active: idx === current}" @click="current = idx"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const images = ref([
  { src: '/assets/banner1.jpg', alt: '产品1', link: '/group/1' },
  { src: '/assets/banner2.jpg', alt: '产品2', link: '/group/2' },
  { src: '/assets/banner3.jpg', alt: '产品3', link: '/group/3' },
]);
const current = ref(0);
let timer = null;
function goToProduct(link) {
  // TODO: 跳转到指定产品页面
  window.location.href = link;
}
onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % images.value.length;
  }, 3000);
});
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.carousel-wrapper {
  display: flex;
  transition: transform 0.5s;
}
.carousel-item {
  min-width: 100%;
  height: 180px;
  display: none;
}
.carousel-item.active {
  display: block;
}
.carousel-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  cursor: pointer;
}
.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.carousel-indicators span {
  display: block;
  width: 10px;
  height: 10px;
  background: #ccc;
  border-radius: 50%;
  cursor: pointer;
}
.carousel-indicators span.active {
  background: #2196f3;
}
</style>
