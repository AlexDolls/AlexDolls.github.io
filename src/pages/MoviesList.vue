<template>
  <div class="movies-list">
    <header class="header">
      <h1>Star Wars Movies Catalogue</h1>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search movies by title..."
          class="search-input"
        />
      </div>
    </header>

    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="movies-grid">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.episode_id"
        :movie="movie"
        @show-details="showMovieDetails"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMovies } from '../services/swapi'
import MovieCard from '../components/MovieCard.vue'

const router = useRouter()

const movies = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) {
    return movies.value
  }
  const query = searchQuery.value.toLowerCase()
  return movies.value.filter(movie =>
    movie.title.toLowerCase().includes(query)
  )
})

async function loadMovies() {
  try {
    loading.value = true
    error.value = null
    const data = await getMovies()
    // Sort by episode_id
    movies.value = data.sort((a, b) => a.episode_id - b.episode_id)
  } catch (err) {
    error.value = 'Failed to load movies. Please try again later.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function showMovieDetails(movie) {
  router.push(`/movie/${movie.episode_id}`)
}

onMounted(() => {
  loadMovies()
})
</script>

<style scoped>
.movies-list {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #ffd700;
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #444;
  border-radius: 8px;
  background-color: #1a1a1a;
  color: #fff;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #ffd700;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #fff;
}

.error {
  color: #ff6b6b;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>

