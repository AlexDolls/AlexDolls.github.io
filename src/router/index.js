import { createRouter, createWebHistory } from 'vue-router'
import MoviesList from '../pages/MoviesList.vue'
import MovieDetail from '../pages/MovieDetail.vue'
import DrillDown from '../pages/DrillDown.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'movies',
      component: MoviesList
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: MovieDetail,
      props: true
    },
    {
      path: '/movie/:id/:type',
      name: 'drill-down',
      component: DrillDown,
      props: true
    }
  ]
})

export default router

