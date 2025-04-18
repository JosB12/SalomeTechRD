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

const enrolledCourses = computed(() => courseStore.getEnrolledCourses);
const isEnrolled = computed(() => 
  enrolledCourses.value.some(course => course.id === courseId.value)
);

const enrollmentProgress = computed(() => {
  const enrolledCourse = enrolledCourses.value.find(c => c.id === courseId.value);
  return enrolledCourse ? enrolledCourse.progress : 0;
});

const expandedModules = ref<number[]>([]);

const toggleModule = (moduleId: number) => {
  const index = expandedModules.value.indexOf(moduleId);
  if (index === -1) {
    expandedModules.value.push(moduleId);
  } else {
    expandedModules.value.splice(index, 1);
  }
};

const isModuleExpanded = (moduleId: number) => {
  return expandedModules.value.includes(moduleId);
};

const enrollInCourse = () => {
  courseStore.enrollInCourse(courseId.value);
};

const startLesson = (lessonId: number) => {
  router.push(`/student/lessons/${lessonId}`);
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="course">
        <!-- Course header -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="relative h-64 md:h-80">
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
              <!-- Enrollment status/progress -->
              <div v-if="isEnrolled" class="mb-4 md:mb-0">
                <div class="flex items-center">
                  <span class="font-medium text-gray-700 mr-3">Progreso: {{ enrollmentProgress }}%</span>
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div class="bg-primary-600 h-2 rounded-full" :style="`width: ${enrollmentProgress}%`"></div>
                  </div>
                </div>
              </div>
              
              <!-- Enroll button -->
              <button 
                v-if="!isEnrolled"
                @click="enrollInCourse"
                class="btn-primary"
              >
                Inscribirme en este curso
              </button>
              
              <!-- Continue button if enrolled -->
              <button 
                v-else
                class="btn-primary"
              >
                Continuar aprendiendo
              </button>
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

        <!-- Course modules & lessons -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Contenido del curso</h2>
          
          <div v-if="modules.length === 0" class="text-center py-8">
            <p class="text-gray-500">El contenido del curso está siendo preparado.</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div v-for="module in modules" :key="module.id" class="py-4">
              <!-- Module header -->
              <div @click="toggleModule(module.id)"
                   class="flex justify-between items-center cursor-pointer">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ module.title }}</h3>
                  <p class="text-sm text-gray-500">{{ module.description }}</p>
                </div>
                <button class="text-gray-500 focus:outline-none">
                  <svg v-if="isModuleExpanded(module.id)" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <!-- Lessons list -->
              <div v-if="isModuleExpanded(module.id)" class="mt-4 space-y-2 pl-4">
                <div v-for="lesson in courseStore.getLessonsByModuleId(module.id)" 
                     :key="lesson.id"
                     class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
                  
                  <button 
                    @click="startLesson(lesson.id)"
                    :disabled="!isEnrolled"
                    class="btn-sm btn-primary"
                    :class="{ 'opacity-50 cursor-not-allowed': !isEnrolled }"
                  >
                    Ver lección
                  </button>
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
          <router-link to="/student/courses" class="btn-primary">
            Volver a cursos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-sm {
  @apply px-3 py-1 text-sm;
}
</style>