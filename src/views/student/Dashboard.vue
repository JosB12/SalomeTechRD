<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/courses';

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const user = computed(() => authStore.user);
const enrolledCourses = computed(() => courseStore.getEnrolledCourses);

// Summary stats
const completedCourses = computed(() => {
  return enrolledCourses.value.filter(course => course.progress === 100).length;
});

const averageProgress = computed(() => {
  if (enrolledCourses.value.length === 0) return 0;
  
  const total = enrolledCourses.value.reduce((sum, course) => sum + course.progress, 0);
  return Math.round(total / enrolledCourses.value.length);
});

const viewCourse = (courseId: number) => {
  router.push(`/student/courses/${courseId}`);
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
              Bienvenido, {{ user?.name }}
            </h1>
            <p class="mt-1 text-gray-500">
              Esta es tu área personal de aprendizaje
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link to="/student/courses" class="btn-primary">
              Ver todos los cursos
            </router-link>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Cursos inscritos</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ enrolledCourses.length }}</p>
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
              <p class="text-sm font-medium text-gray-500">Cursos completados</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ completedCourses }}</p>
            </div>
            <div class="bg-green-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Progreso promedio</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ averageProgress }}%</p>
            </div>
            <div class="bg-accent-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-accent-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- My courses -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Mis cursos</h2>
        
        <div v-if="enrolledCourses.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No estás inscrito en ningún curso</h3>
          <p class="mt-1 text-gray-500">Explora nuestro catálogo y encuentra cursos que te interesen</p>
          <div class="mt-6">
            <router-link to="/student/courses" class="btn-primary">
              Explorar cursos
            </router-link>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in enrolledCourses" :key="course.id" class="card hover:cursor-pointer" @click="viewCourse(course.id)">
            <div class="relative h-40">
              <img :src="course.thumbnail" class="w-full h-full object-cover" :alt="course.title">
              <div class="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
                {{ course.level }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ course.title }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ course.subject }}</p>
              
              <div class="mb-2 flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Progreso: {{ course.progress }}%</span>
                <span v-if="course.progress === 100" class="text-xs text-white bg-green-500 rounded-full px-2 py-0.5">Completado</span>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary-600 h-2 rounded-full" :style="`width: ${course.progress}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>