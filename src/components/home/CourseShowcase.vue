<script setup lang="ts">
import { computed } from 'vue';
import { mockCourses } from '@/data/mockData';

const featuredCourses = computed(() => {
  return mockCourses.slice(0, 3);
});
</script>

<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Nuestros Cursos Destacados
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Explora nuestra selección de cursos diseñados para potenciar tus habilidades docentes.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div v-for="course in featuredCourses" :key="course.id" 
             class="card group overflow-hidden">
          <div class="relative h-60">
            <img :src="course.thumbnail" 
                 class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                 :alt="course.title">
            <div class="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
              {{ course.level }}
            </div>
          </div>
          <div class="p-6">
            <span class="inline-block mb-2 text-xs font-medium text-primary-600 uppercase tracking-wider">
              {{ course.subject }}
            </span>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ course.title }}</h3>
            <p class="text-gray-600 mb-5 line-clamp-2">{{ course.description }}</p>
            <router-link to="/login" class="btn-outline inline-flex items-center">
              Ver detalles
              <svg class="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <router-link to="/register" class="btn-primary inline-flex items-center text-lg px-8 py-3">
          Ver todos los cursos
          <svg class="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>