<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/courses';
import { mockUsers } from '@/data/mockData';

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const search = ref('');
const selectedLevel = ref('');
const selectedSubject = ref('');

const allCourses = computed(() => courseStore.getAllCourses);
const trainers = computed(() => mockUsers.filter(user => user.role === 'trainer'));

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

const getTrainerName = (trainerId: number) => {
  const trainer = trainers.value.find(t => t.id === trainerId);
  return trainer ? trainer.name : 'No asignado';
};

const editCourse = (courseId: number) => {
  router.push(`/admin/courses/${courseId}/edit`);
};

const addNewCourse = () => {
  router.push('/admin/courses/new');
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
              Administrar Cursos
            </h1>
            <p class="mt-1 text-gray-500">
              Gestiona todos los cursos de la plataforma
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <button @click="addNewCourse" class="btn-primary">
              Añadir nuevo curso
            </button>
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
            <label for="subject" class="form-label">Categoría</label>
            <select
              id="subject"
              v-model="selectedSubject"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
            >
              <option value="">Todas las categorías</option>
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

      <!-- Courses table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div v-if="filteredCourses.length === 0" class="p-8 text-center">
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
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacitador
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha creación
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="course in filteredCourses" :key="course.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ course.title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ course.subject }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="{
                          'bg-green-100 text-green-800': course.level === 'Principiante',
                          'bg-yellow-100 text-yellow-800': course.level === 'Intermedio',
                          'bg-red-100 text-red-800': course.level === 'Avanzado'
                        }">
                    {{ course.level }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ getTrainerName(course.trainerId) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ new Date(course.createdAt).toLocaleDateString() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editCourse(course.id)" class="text-primary-600 hover:text-primary-900 mr-3">
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>