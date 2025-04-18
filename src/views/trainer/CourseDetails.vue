<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courses';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const authStore = useAuthStore();

const courseId = computed(() => parseInt(route.params.id as string));
const course = computed(() => courseStore.getCourseById(courseId.value));
const modules = computed(() => courseStore.getModulesByCourseId(courseId.value));

// Get student data for this course
const students = computed(() => courseStore.getStudentsByCourseId(courseId.value));

// Calculate progres stats
const averageProgress = computed(() => {
  if (students.value.length === 0) return 0;
  
  const total = students.value.reduce((sum, student) => sum + student.progress, 0);
  return Math.round(total / students.value.length);
});

const progressDistribution = computed(() => {
  const ranges = [
    { min: 0, max: 25, count: 0, label: '0-25%' },
    { min: 25, max: 50, count: 0, label: '25-50%' },
    { min: 50, max: 75, count: 0, label: '50-75%' },
    { min: 75, max: 100, count: 0, label: '75-100%' }
  ];
  
  students.value.forEach(student => {
    for (const range of ranges) {
      if (student.progress >= range.min && student.progress <= range.max) {
        range.count++;
        break;
      }
    }
  });
  
  return ranges;
});

// Sending reminders functionality
const selectedStudents = ref<number[]>([]);

const selectAllStudents = (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    selectedStudents.value = students.value.map(student => student.userId);
  } else {
    selectedStudents.value = [];
  }
};

const isStudentSelected = (userId: number) => {
  return selectedStudents.value.includes(userId);
};

const toggleStudentSelection = (userId: number) => {
  const index = selectedStudents.value.indexOf(userId);
  if (index === -1) {
    selectedStudents.value.push(userId);
  } else {
    selectedStudents.value.splice(index, 1);
  }
};

const sendReminders = () => {
  if (selectedStudents.value.length === 0) {
    alert('Selecciona al menos un estudiante para enviar recordatorios.');
    return;
  }
  
  alert(`Recordatorios enviados a ${selectedStudents.value.length} estudiantes.`);
  selectedStudents.value = [];
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="course">
        <!-- Course header -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="relative h-64">
            <img :src="course.thumbnail" class="w-full h-full object-cover" :alt="course.title">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex flex-wrap gap-2 mb-2">
                <span class="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {{ course.level }}
                </span>
                <span class="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {{ course.subject }}
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-white">{{ course.title }}</h1>
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <!-- Go back button -->
              <router-link to="/trainer/courses" class="inline-flex items-center text-gray-600 hover:text-primary-600">
                <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a mis cursos
              </router-link>
            </div>
            
            <h2 class="text-xl font-bold text-gray-900 mb-2">Acerca de este curso</h2>
            <p class="text-gray-700 mb-6">{{ course.description }}</p>
            
            <h2 class="text-xl font-bold text-gray-900 mb-2">Objetivos del curso</h2>
            <ul class="list-disc pl-5 mb-6 text-gray-700">
              <li v-for="(objective, index) in course.objectives" :key="index" class="mb-1">
                {{ objective }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Course stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">Total estudiantes</p>
                <p class="mt-1 text-3xl font-semibold text-gray-900">{{ students.length }}</p>
              </div>
              <div class="bg-primary-100 p-2 rounded-md">
                <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          
          <div class="bg-white rounded-lg shadow-sm p-6">
            <p class="text-sm font-medium text-gray-500 mb-2">Distribución de progreso</p>
            <div class="space-y-2">
              <div v-for="(range, index) in progressDistribution" :key="index" class="flex items-center">
                <span class="text-xs w-16 text-gray-500">{{ range.label }}</span>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mx-2">
                  <div class="h-2.5 rounded-full" 
                       :class="{
                         'bg-red-500': index === 0,
                         'bg-yellow-500': index === 1,
                         'bg-blue-500': index === 2,
                         'bg-green-500': index === 3
                       }"
                       :style="`width: ${students.length > 0 ? (range.count / students.length) * 100 : 0}%`"></div>
                </div>
                <span class="text-xs w-7 text-right text-gray-500">{{ range.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Student list -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Estudiantes inscritos</h2>
            <button 
              v-if="selectedStudents.length > 0"
              @click="sendReminders"
              class="btn-primary"
            >
              Enviar recordatorio ({{ selectedStudents.length }})
            </button>
          </div>
          
          <div v-if="students.length === 0" class="p-8 text-center">
            <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Aún no hay estudiantes inscritos</h3>
            <p class="mt-1 text-gray-500">Los estudiantes aparecerán aquí cuando se inscriban al curso</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox"
                      @change="selectAllStudents"
                      :checked="selectedStudents.length === students.length"
                      class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    >
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Estudiante
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última actividad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(student, index) in students" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox"
                      :checked="isStudentSelected(student.userId)"
                      @change="toggleStudentSelection(student.userId)"
                      class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">#{{ student.userId }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm text-gray-900 mr-2">{{ student.progress }}%</span>
                      <div class="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          class="h-2 rounded-full" 
                          :class="{
                            'bg-red-500': student.progress < 25,
                            'bg-yellow-500': student.progress >= 25 && student.progress < 50,
                            'bg-blue-500': student.progress >= 50 && student.progress < 75,
                            'bg-green-500': student.progress >= 75
                          }"
                          :style="`width: ${student.progress}%`"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(student.lastActivity).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      @click="toggleStudentSelection(student.userId)"
                      :class="{ 'text-primary-600 hover:text-primary-900': !isStudentSelected(student.userId), 'text-red-600 hover:text-red-900': isStudentSelected(student.userId) }"
                      class="font-medium"
                    >
                      {{ isStudentSelected(student.userId) ? 'Cancelar' : 'Recordatorio' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Course modules -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Contenido del curso</h2>
          
          <div v-if="modules.length === 0" class="text-center py-8">
            <p class="text-gray-500">El contenido del curso está siendo preparado por el administrador.</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="module in modules" :key="module.id" class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 p-4 border-b border-gray-200">
                <h3 class="font-medium text-gray-900">{{ module.title }}</h3>
                <p class="text-sm text-gray-500">{{ module.description }}</p>
              </div>
              
              <div class="divide-y divide-gray-200">
                <div v-for="lesson in courseStore.getLessonsByModuleId(module.id)" 
                     :key="lesson.id"
                     class="p-4">
                  <div class="flex items-center">
                    <!-- Icon based on lesson type -->
                    <div class="h-10 w-10 flex items-center justify-center rounded-full" 
                         :class="{
                           'bg-primary-100 text-primary-600': lesson.type === 'video',
                           'bg-accent-100 text-accent-600': lesson.type === 'text',
                           'bg-secondary-100 text-secondary-600': lesson.type === 'pdf'
                         }">
                      <svg v-if="lesson.type === 'video'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <svg v-else-if="lesson.type === 'text'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <div class="ml-4">
                      <h4 class="text-sm font-medium text-gray-900">{{ lesson.title }}</h4>
                      <div class="text-xs text-gray-500 flex items-center">
                        <span class="capitalize">{{ lesson.type }}</span>
                        <span class="mx-1">•</span>
                        <span>{{ lesson.duration }} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Curso no encontrado</h3>
        <div class="mt-6">
          <router-link to="/trainer/courses" class="btn-primary">
            Volver a mis cursos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>