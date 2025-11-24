<template>
  <div class="drill-down-page">
    <div class="page-content">
      <button class="back-btn" @click="goBack">← Back to Movie</button>
      
      <div v-if="loading" class="loading">Loading {{ type }}...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="drill-down-content">
        <div class="drill-down-header">
          <h1>{{ capitalize(type) }}</h1>
          <span class="movie-title">{{ movieTitle }}</span>
        </div>

        <div class="drill-down-body">
          <div v-if="items.length === 0" class="empty">
            No {{ type }} available
          </div>
          <div v-else class="items-grid">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="item-card"
            >
              <h3>{{ getItemName(item) }}</h3>
              <div class="item-details">
                <div
                  v-for="(value, key) in getItemDetails(item)"
                  :key="key"
                  class="detail-row"
                >
                  <span class="detail-label">{{ formatLabel(key) }}:</span>
                  <span class="detail-value">{{ formatValue(value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMovies, fetchMultipleResources } from '../services/swapi'

const router = useRouter()
const route = useRoute()

const items = ref([])
const loading = ref(true)
const error = ref(null)
const movieTitle = ref('')
const movie = ref(null)

const movieId = parseInt(route.params.id)
const type = route.params.type

const detailFields = {
  characters: ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year'],
  starships: ['name', 'model', 'manufacturer', 'length', 'crew', 'passengers', 'starship_class'],
  vehicles: ['name', 'model', 'manufacturer', 'length', 'crew', 'passengers', 'vehicle_class'],
  species: ['name', 'classification', 'designation', 'average_height', 'average_lifespan', 'language', 'homeworld']
}

onMounted(async () => {
  await loadMovie()
  await loadItems()
})

async function loadMovie() {
  try {
    const movies = await getMovies()
    const foundMovie = movies.find(m => m.episode_id === movieId)
    if (foundMovie) {
      movie.value = foundMovie
      movieTitle.value = foundMovie.title
    }
  } catch (err) {
    console.error('Error loading movie:', err)
  }
}

async function loadItems() {
  if (!movie.value) {
    await loadMovie()
  }

  const urls = movie.value?.[type] || []
  
  if (!urls || urls.length === 0) {
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null

    const data = await fetchMultipleResources(urls)
    items.value = data.filter(item => item !== null)
  } catch (err) {
    error.value = `Failed to load ${type}. Please try again.`
    console.error(err)
  } finally {
    loading.value = false
  }
}

function getItemName(item) {
  return item.name || 'Unknown'
}

function getItemDetails(item) {
  const fields = detailFields[type] || []
  const details = {}
  
  fields.forEach(field => {
    if (item[field] !== undefined && item[field] !== null && item[field] !== '') {
      details[field] = item[field]
    }
  })

  return details
}

function formatLabel(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatValue(value) {
  if (value === 'n/a' || value === 'unknown' || value === 'none') {
    return 'N/A'
  }
  return value
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function goBack() {
  router.push(`/movie/${movieId}`)
}
</script>

<style scoped>
.drill-down-page {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.page-content {
  max-width: 1200px;
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
}

.back-btn:hover {
  border-color: #ffd700;
  color: #ffd700;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #fff;
}

.error {
  color: #ff6b6b;
}

.drill-down-content {
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  border: 2px solid #ffd700;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.drill-down-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #444;
  flex-wrap: wrap;
  gap: 1rem;
}

.drill-down-header h1 {
  color: #ffd700;
  font-size: 2.5rem;
  margin: 0;
}

.movie-title {
  color: #aaa;
  font-size: 1.1rem;
  font-style: italic;
}

.drill-down-body {
  margin-top: 1rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.item-card {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.item-card:hover {
  border-color: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
}

.item-card h3 {
  color: #ffd700;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.detail-label {
  color: #aaa;
  font-weight: 500;
}

.detail-value {
  color: #fff;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

@media (max-width: 768px) {
  .drill-down-page {
    padding: 1rem;
  }

  .drill-down-header h1 {
    font-size: 1.75rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>

