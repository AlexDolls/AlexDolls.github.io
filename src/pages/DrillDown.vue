<template>
  <div class="drill-down-page">
    <div class="page-content">
      <button class="back-btn" @click="goBack">← Back to Movie</button>
      
      <div v-if="loading" class="loading-wrapper">
        <LoadingSpinner :message="getLoadingMessage()" />
      </div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <Transition name="fade" appear>
        <div v-if="!loading && !error" class="drill-down-content">
        <div class="drill-down-header">
          <h1>{{ capitalize(type) }}</h1>
          <span class="movie-title">{{ movieTitle }}</span>
        </div>

        <div class="drill-down-body">
          <div v-if="items.length === 0" class="empty">
            No {{ type }} available
          </div>
          <TransitionGroup
            v-else
            name="item-list"
            tag="div"
            class="items-grid"
          >
            <div
              v-for="(item, index) in items"
              :key="index"
              class="item-card"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <h3>{{ getItemName(item) }}</h3>
              <div class="item-details">
                <div
                  v-for="(value, key) in getItemDetails(item)"
                  :key="key"
                  class="detail-row"
                >
                  <span class="detail-label">{{ formatLabel(key) }}:</span>
                  <span class="detail-value">
                    <span v-if="isLoadingPlanet(value, key)" class="planet-loading">
                      <span class="mini-spinner"></span> Loading planet...
                    </span>
                    <span v-else>{{ formatValue(value, key) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMovies, fetchMultipleResources, getPlanet } from '../services/swapi'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()

const items = ref([])
const loading = ref(true)
const error = ref(null)
const movieTitle = ref('')
const movie = ref(null)
const planetNames = ref({}) // Map of planet URLs to planet names

const movieId = parseInt(route.params.id)
const type = route.params.type
const loadingPlanets = ref(false)

const detailFields = {
  characters: ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year'],
  starships: ['name', 'model', 'manufacturer', 'length', 'crew', 'passengers', 'starship_class'],
  vehicles: ['name', 'model', 'manufacturer', 'cost_in_credits', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'vehicle_class'],
  species: ['name', 'classification', 'designation', 'average_height', 'skin_colors', 'hair_colors', 'eye_colors', 'average_lifespan', 'homeworld', 'language']
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

    // If loading species, fetch homeworld planet names
    if (type === 'species') {
      loadingPlanets.value = true
      await loadPlanetNames()
      loadingPlanets.value = false
    }
  } catch (err) {
    error.value = `Failed to load ${type}. Please try again.`
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function loadPlanetNames() {
  const homeworldUrls = items.value
    .map(item => item.homeworld)
    .filter(url => url && url !== 'null' && url !== null)

  if (homeworldUrls.length === 0) {
    return
  }

  try {
    const planets = await fetchMultipleResources(homeworldUrls)
    planets.forEach(planet => {
      if (planet && planet.url && planet.name) {
        planetNames.value[planet.url] = planet.name
      }
    })
  } catch (err) {
    console.error('Error loading planet names:', err)
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

function formatValue(value, key) {
  if (value === 'n/a' || value === 'unknown' || value === 'none' || value === null) {
    return 'N/A'
  }
  
  // Handle homeworld - display planet name instead of URL
  if (key === 'homeworld' && typeof value === 'string' && value.startsWith('http')) {
    return planetNames.value[value] || 'Unknown Planet'
  }
  
  return value
}

function isLoadingPlanet(value, key) {
  return key === 'homeworld' && 
         typeof value === 'string' && 
         value.startsWith('http') && 
         !planetNames.value[value] &&
         loadingPlanets.value
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getLoadingMessage() {
  const typeNames = {
    characters: 'Characters',
    starships: 'Starships',
    vehicles: 'Vehicles',
    species: 'Species'
  }
  return `Loading ${typeNames[type] || capitalize(type)}...`
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
  position: relative;
  z-index: 1;
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

.loading-wrapper {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: fadeInScale 0.5s ease-out both;
  position: relative;
  overflow: hidden;
}

.item-card::before {
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

.item-card:hover::before {
  left: 100%;
}

.item-card:hover {
  border-color: #ffd700;
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.item-list-enter-active {
  transition: all 0.5s ease-out;
}

.item-list-leave-active {
  transition: all 0.3s ease-in;
}

.item-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.item-list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.item-list-move {
  transition: transform 0.5s ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
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

.planet-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  font-style: italic;
}

.mini-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

