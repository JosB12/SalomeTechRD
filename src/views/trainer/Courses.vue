<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/courses';

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const courses = computed(() => courseStore.getTrainerCourses);

const viewCourse = (courseId: number) => {
  router.push(`/trainer/courses/${courseId}`);
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
              Mis Cursos
            </h1>
            <p class="mt-1 text-gray-500">
              Administra los cursos que impartes
            </p>
          </div>
        </div>
      </div>

      <!-- Courses grid -->
      <div v-if="courses.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Aún no tienes cursos asignados</h3>
        <p class="mt-1 text-gray-500">Contacta con el administrador para que te asigne cursos</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="course in courses" :key="course.id" 
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
            
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ courseStore.getStudentsByCourseId(course.id).length }} estudiantes
                </div>
              </div>
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