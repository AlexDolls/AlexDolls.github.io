<template>
  <div class="loading-spinner">
    <div class="spinner-container">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#ffd700"
          stroke-width="4"
        />
      </svg>
      <div class="stars">
        <span class="star star-1">✦</span>
        <span class="star star-2">✦</span>
        <span class="star star-3">✦</span>
        <span class="star star-4">✦</span>
      </div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 200px;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner {
  width: 80px;
  height: 80px;
  animation: rotate 2s linear infinite;
  transform-origin: center;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.stars {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  color: #ffd700;
  font-size: 12px;
  animation: twinkle 1.5s ease-in-out infinite;
}

.star-1 {
  top: 0;
  left: 50%;
  animation-delay: 0s;
}

.star-2 {
  top: 50%;
  right: 0;
  animation-delay: 0.375s;
}

.star-3 {
  bottom: 0;
  left: 50%;
  animation-delay: 0.75s;
}

.star-4 {
  top: 50%;
  left: 0;
  animation-delay: 1.125s;
}

.loading-message {
  margin-top: 1.5rem;
  color: #ffd700;
  font-size: 1.1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
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

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
</style>

