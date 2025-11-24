<template>
  <div class="movie-detail-page">
    <div class="page-content">
      <button class="back-btn" @click="goBack">← Back to Movies</button>
      
      <LoadingSpinner v-if="loading" message="Loading movie details..." />
      <div v-else-if="error" class="error">{{ error }}</div>
      <Transition name="fade" appear>
        <div v-if="movie && !loading" class="movie-detail">
        <div class="detail-header">
          <h1>{{ movie.title }}</h1>
          <span class="episode-badge">Episode {{ movie.episode_id }}</span>
        </div>

        <div class="detail-body">
          <div class="info-section">
            <div class="info-item">
              <span class="info-label">Release Date:</span>
              <span class="info-value">{{ formatDate(movie.release_date) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Director:</span>
              <span class="info-value">{{ movie.director }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Producer:</span>
              <span class="info-value">{{ movie.producer }}</span>
            </div>
          </div>

          <div class="opening-crawl-section">
            <h2>Opening Crawl</h2>
            <p>{{ movie.opening_crawl }}</p>
          </div>

          <div class="drill-downs">
            <DrillDownButton
              title="Characters"
              :count="movie.characters?.length || 0"
              @click="navigateToDrillDown('characters')"
            />
            <DrillDownButton
              title="Starships"
              :count="movie.starships?.length || 0"
              @click="navigateToDrillDown('starships')"
            />
            <DrillDownButton
              title="Vehicles"
              :count="movie.vehicles?.length || 0"
              @click="navigateToDrillDown('vehicles')"
            />
            <DrillDownButton
              title="Species"
              :count="movie.species?.length || 0"
              @click="navigateToDrillDown('species')"
            />
          </div>
        </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMovies, getMovie } from '../services/swapi'
import DrillDownButton from '../components/DrillDownButton.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()

const movie = ref(null)
const loading = ref(true)
const error = ref(null)

const movieId = parseInt(route.params.id)

async function loadMovie() {
  try {
    loading.value = true
    error.value = null
    
    // Try to get movie by episode_id from the list
    const movies = await getMovies()
    const foundMovie = movies.find(m => m.episode_id === movieId)
    
    if (foundMovie) {
      movie.value = foundMovie
    } else {
      // Fallback: try to fetch by ID directly
      try {
        movie.value = await getMovie(movieId)
      } catch (err) {
        throw new Error('Movie not found')
      }
    }
  } catch (err) {
    error.value = 'Failed to load movie. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function navigateToDrillDown(type) {
  router.push(`/movie/${movieId}/${type}`)
}

function goBack() {
  router.push('/')
}

onMounted(() => {
  loadMovie()
})
</script>

<style scoped>
.movie-detail-page {
  min-height: 100vh;
  padding: 2rem;
  background: transparent;
  position: relative;
  z-index: 1;
}

.page-content {
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: 2px solid #444;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  transition: left 0.5s;
}

.back-btn:hover::before {
  left: 100%;
}

.back-btn:hover {
  border-color: #ffd700;
  color: #ffd700;
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #fff;
}

.error {
  color: #ff6b6b;
}

.movie-detail {
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  border: 2px solid #ffd700;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideInUp 0.6s ease-out;
}

.fade-enter-active {
  transition: all 0.5s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #444;
}

.detail-header h1 {
  color: #ffd700;
  font-size: 2.5rem;
  margin: 0;
  flex: 1;
}

.episode-badge {
  background-color: #ffd700;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #444;
}

.info-label {
  color: #aaa;
  font-weight: 500;
}

.info-value {
  color: #fff;
  text-align: right;
}

.opening-crawl-section {
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border-left: 4px solid #ffd700;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.opening-crawl-section h2 {
  color: #ffd700;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.opening-crawl-section p {
  color: #ccc;
  line-height: 1.8;
  font-style: italic;
  margin: 0;
  white-space: pre-line;
  font-size: 1.1rem;
}

.drill-downs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .movie-detail-page {
    padding: 1rem;
  }

  .detail-header h1 {
    font-size: 1.75rem;
  }

  .drill-downs {
    grid-template-columns: 1fr;
  }
}
</style>

