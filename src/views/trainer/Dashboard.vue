<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCourseStore } from '@/stores/courses';

const router = useRouter();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const user = computed(() => authStore.user);
const courses = computed(() => courseStore.getTrainerCourses);

// Get all students data across all courses
const allStudentData = computed(() => {
  let data = [];
  for (const course of courses.value) {
    const students = courseStore.getStudentsByCourseId(course.id);
    data.push(...students.map(student => ({
      ...student,
      courseId: course.id,
      courseTitle: course.title
    })));
  }
  return data;
});

// Stats
const totalStudents = computed(() => {
  // Get unique student IDs
  const uniqueStudentIds = new Set(allStudentData.value.map(student => student.userId));
  return uniqueStudentIds.size;
});

const averageProgress = computed(() => {
  if (allStudentData.value.length === 0) return 0;
  
  const total = allStudentData.value.reduce((sum, student) => sum + student.progress, 0);
  return Math.round(total / allStudentData.value.length);
});

const lowProgressStudents = computed(() => {
  return allStudentData.value.filter(student => student.progress < 30);
});

// Send reminders to students with low progress
const sendReminders = () => {
  alert(`Recordatorios enviados a ${lowProgressStudents.value.length} estudiantes con progreso bajo.`);
};

const viewCourse = (courseId: number) => {
  router.push(`/trainer/courses/${courseId}`);
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
              Panel de Capacitador
            </h1>
            <p class="mt-1 text-gray-500">
              Bienvenido, {{ user?.name }}
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link to="/trainer/courses" class="btn-primary">
              Ver mis cursos
            </router-link>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Cursos activos</p>
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
              <p class="text-sm font-medium text-gray-500">Total estudiantes</p>
              <p class="mt-1 text-3xl font-semibold text-gray-900">{{ totalStudents }}</p>
            </div>
            <div class="bg-secondary-100 p-2 rounded-md">
              <svg class="h-6 w-6 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
        
        <div v-if="courses.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Aún no tienes cursos asignados</h3>
          <p class="mt-1 text-gray-500">Contacta con el administrador para que te asigne cursos</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="course in courses" :key="course.id" class="card hover:cursor-pointer" @click="viewCourse(course.id)">
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
              
              <div class="mt-4 flex justify-between">
                <div class="text-sm text-gray-500">
                  <!-- Show number of students -->
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {{ courseStore.getStudentsByCourseId(course.id).length }} estudiantes
                  </div>
                </div>
                <button class="btn-primary text-sm">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Students with low progress -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Estudiantes con bajo progreso</h2>
        
        <div v-if="lowProgressStudents.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg class="h-12 w-12 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">¡Todos tus estudiantes van bien!</h3>
          <p class="mt-1 text-gray-500">No hay estudiantes con progreso menor al 30%</p>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6 bg-red-50 border-b border-red-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="h-6 w-6 text-red-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 class="text-lg font-medium text-red-800">
                  {{ lowProgressStudents.length }} estudiantes con progreso menor al 30%
                </h3>
              </div>
              <button @click="sendReminders" class="btn-primary">
                Enviar recordatorios
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Estudiante
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última actividad
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(student, index) in lowProgressStudents" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">#{{ student.userId }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ student.courseTitle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm text-gray-900 mr-2">{{ student.progress }}%</span>
                      <div class="w-24 bg-gray-200 rounded-full h-2">
                        <div class="bg-red-500 h-2 rounded-full" :style="`width: ${student.progress}%`"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(student.lastActivity).toLocaleDateString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>