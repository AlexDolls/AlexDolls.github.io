<template>
  <div class="movie-card" @click="handleClick">
    <div class="card-header">
      <h2 class="movie-title">{{ movie.title }}</h2>
      <span class="episode-badge">Episode {{ movie.episode_id }}</span>
    </div>
    <div class="card-body">
      <div class="info-row">
        <span class="label">Release Date:</span>
        <span class="value">{{ formatDate(movie.release_date) }}</span>
      </div>
      <div class="info-row">
        <span class="label">Director:</span>
        <span class="value">{{ movie.director }}</span>
      </div>
      <div class="info-row">
        <span class="label">Producer:</span>
        <span class="value">{{ movie.producer }}</span>
      </div>
      <div class="opening-crawl">
        <p>{{ truncateText(movie.opening_crawl, 150) }}</p>
      </div>
    </div>
    <div class="card-footer">
      <button class="view-details-btn">View Details</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['show-details'])

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function handleClick() {
  emit('show-details', props.movie)
}
</script>

<style scoped>
.movie-card {
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  border: 2px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.movie-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 215, 0, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.movie-card:hover::before {
  left: 100%;
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: #ffd700;
  box-shadow: 0 12px 32px rgba(255, 215, 0, 0.4);
}

.movie-card:active {
  transform: translateY(-4px) scale(1.01);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.movie-title {
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  transition: all 0.3s ease;
}

.movie-card:hover .movie-title {
  color: #ffed4e;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.episode-badge {
  background-color: #ffd700;
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap;
}

.card-body {
  flex: 1;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.label {
  color: #aaa;
  font-weight: 500;
}

.value {
  color: #fff;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.opening-crawl {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #444;
}

.opening-crawl p {
  color: #ccc;
  font-style: italic;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

.card-footer {
  margin-top: auto;
}

.view-details-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #ffd700;
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
}

.view-details-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.view-details-btn:hover::after {
  width: 300px;
  height: 300px;
}

.view-details-btn:hover {
  background-color: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.view-details-btn:active {
  transform: translateY(0);
}
</style>

