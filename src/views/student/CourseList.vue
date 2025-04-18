<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courses';

const router = useRouter();
const courseStore = useCourseStore();

const search = ref('');
const selectedLevel = ref('');
const selectedSubject = ref('');

const allCourses = computed(() => courseStore.getAllCourses);

// Get unique levels and subjects for filters
const levels = computed(() => {
  const levelsSet = new Set(allCourses.value.map(course => course.level));
  return Array.from(levelsSet);
});

const subjects = computed(() => {
  const subjectsSet = new Set(allCourses.value.map(course => course.subject));
  return Array.from(subjectsSet);
});

// Filtered courses
const filteredCourses = computed(() => {
  return allCourses.value.filter(course => {
    const matchesSearch = search.value === '' || 
      course.title.toLowerCase().includes(search.value.toLowerCase()) ||
      course.description.toLowerCase().includes(search.value.toLowerCase());
    
    const matchesLevel = selectedLevel.value === '' || course.level === selectedLevel.value;
    const matchesSubject = selectedSubject.value === '' || course.subject === selectedSubject.value;
    
    return matchesSearch && matchesLevel && matchesSubject;
  });
});

const clearFilters = () => {
  search.value = '';
  selectedLevel.value = '';
  selectedSubject.value = '';
};

const viewCourse = (courseId: number) => {
  router.push(`/student/courses/${courseId}`);
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-8 p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Catálogo de Cursos
            </h1>
            <p class="mt-1 text-gray-500">
              Explora todos nuestros cursos y comienza tu aprendizaje
            </p>
          </div>
        </div>
      </div>

      <!-- Search and filters -->
      <div class="bg-white rounded-lg shadow-sm mb-8 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="md:col-span-2">
            <label for="search" class="form-label">Buscar</label>
            <input
              id="search"
              type="text"
              v-model="search"
              placeholder="Buscar cursos..."
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label for="level" class="form-label">Nivel</label>
            <select
              id="level"
              v-model="selectedLevel"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
            >
              <option value="">Todos los niveles</option>
              <option v-for="level in levels" :key="level" :value="level">
                {{ level }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="subject" class="form-label">Materia</label>
            <select
              id="subject"
              v-model="selectedSubject"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
            >
              <option value="">Todas las materias</option>
              <option v-for="subject in subjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button @click="clearFilters" class="btn-outline">
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Courses grid -->
      <div v-if="filteredCourses.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No se encontraron cursos</h3>
        <p class="mt-1 text-gray-500">Intenta con otros criterios de búsqueda</p>
        <div class="mt-6">
          <button @click="clearFilters" class="btn-primary">
            Ver todos los cursos
          </button>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in filteredCourses" :key="course.id" 
             class="card hover:cursor-pointer" @click="viewCourse(course.id)">
          <div class="relative h-40">
            <img :src="course.thumbnail" class="w-full h-full object-cover" :alt="course.title">
            <div class="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
              {{ course.level }}
            </div>
          </div>
          <div class="p-6">
            <span class="inline-block mb-2 text-xs font-medium text-primary-600 uppercase tracking-wider">
              {{ course.subject }}
            </span>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ course.title }}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ course.description }}</p>
            
            <div class="mt-4 flex justify-end">
              <button class="btn-primary">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>