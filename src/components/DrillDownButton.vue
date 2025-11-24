<template>
  <button class="drill-down-btn" @click="$emit('click')">
    <span class="btn-title">{{ title }}</span>
    <span class="btn-count">{{ count }}</span>
  </button>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

defineEmits(['click'])
</script>

<style scoped>
.drill-down-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%);
  border: 2px solid #444;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.drill-down-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.drill-down-btn:hover::before {
  width: 300px;
  height: 300px;
}

.drill-down-btn:hover {
  border-color: #ffd700;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
}

.drill-down-btn:active {
  transform: translateY(-2px) scale(1.02);
}

.btn-title {
  font-weight: bold;
  font-size: 1rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.drill-down-btn:hover .btn-title {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.btn-count {
  font-size: 0.85rem;
  color: #ffd700;
  position: relative;
  z-index: 1;
  font-weight: bold;
  transition: all 0.3s ease;
}

.drill-down-btn:hover .btn-count {
  color: #ffed4e;
  transform: scale(1.1);
}
</style>

