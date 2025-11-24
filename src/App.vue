<template>
  <div class="app-container">
    <div class="stars-background">
      <div v-for="n in 50" :key="n" class="star" :style="getStarStyle(n)"></div>
    </div>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'

function getStarStyle(index) {
  const size = Math.random() * 2 + 1
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 3
  const duration = Math.random() * 2 + 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #0a0a0a;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;
}

.app-container {
  position: relative;
  min-height: 100vh;
}

.stars-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.star {
  position: absolute;
  background: #ffd700;
  border-radius: 50%;
  opacity: 0.6;
  animation: twinkle infinite;
  box-shadow: 0 0 6px rgba(255, 215, 0, 0.8);
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  position: relative;
  z-index: 1;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
