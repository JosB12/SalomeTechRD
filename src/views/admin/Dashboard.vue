<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/courses';
import { mockUsers } from '@/data/mockData';

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const user = computed(() => authStore.user);
const courses = computed(() => courseStore.getAllCourses);

// Filter for trainers only
const trainers = computed(() => {
  return mockUsers.filter(user => user.role === 'trainer');
});

// Filter for students only
const students = computed(() => {
  return mockUsers.filter(user => user.role === 'student');
});

// Count enrollments
const totalEnrollments = computed(() => {
  return mockUsers.filter(user => user.role === 'student').length;
});

// Get all course categories
const courseCategories = computed(() => {
  const subjects = courses.value.map(course => course.subject);
  const uniqueSubjects = [...new Set(subjects)];
  return uniqueSubjects;
});

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-8 p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Panel de Administrador
            </h1>
            <p class="mt-1 text-gray-500">
              Bienvenido, {{ user?.name }}
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link to="/admin/courses/new" class="btn-primary">
              Añadir nuevo curso
            </router-link>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Total cursos</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ courses.length }}</p>
            </div>
            <div class="bg-primary-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Categorías</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ courseCategories.length }}</p>
            </div>
            <div class="bg-secondary-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Capacitadores</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ trainers.length }}</p>
            </div>
            <div class="bg-accent-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Estudiantes</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ students.length }}</p>
            </div>
            <div class="bg-green-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Acciones rápidas</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              @click="navigateTo('/admin/courses/new')"
              class="flex items-center justify-center p-4 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <div class="flex flex-col items-center text-center">
                <div class="bg-primary-100 p-3 rounded-full">
                  <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span class="mt-2 text-sm font-medium text-gray-900">Nuevo curso</span>
              </div>
            </button>
            
            <button 
              @click="navigateTo('/admin/courses')"
              class="flex items-center justify-center p-4 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <div class="flex flex-col items-center text-center">
                <div class="bg-primary-100 p-3 rounded-full">
                  <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <span class="mt-2 text-sm font-medium text-gray-900">Administrar cursos</span>
              </div>
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Estado del Sistema</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span class="font-medium text-gray-700">Uso de capacidad</span>
                <span class="text-gray-500">85%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span class="font-medium text-gray-700">Tasa de inscripción</span>
                <span class="text-gray-500">62%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-accent-500 h-2 rounded-full" style="width: 62%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between mb-1 text-sm">
                <span class="font-medium text-gray-700">Tasa de finalización</span>
                <span class="text-gray-500">48%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 48%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent courses -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Cursos recientes</h2>
          <router-link to="/admin/courses" class="text-sm font-medium text-primary-600 hover:text-primary-800">
            Ver todos
          </router-link>
        </div>
        
        <div class="overflow-x-auto">
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
                  Fecha
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="course in courses.slice(0, 5)" :key="course.id">
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
                    {{ trainers.find(t => t.id === course.trainerId)?.name || 'No asignado' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ new Date(course.createdAt).toLocaleDateString() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link :to="`/admin/courses/${course.id}/edit`" class="text-primary-600 hover:text-primary-900 mr-3">
                    Editar
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>