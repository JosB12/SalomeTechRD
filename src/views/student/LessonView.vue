<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courses';
import { mockModules } from '@/data/mockData';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();

const lessonId = computed(() => parseInt(route.params.id as string));
const lesson = computed(() => courseStore.getLessonById(lessonId.value));

// Encontrar módulo directamente por ID
const module = computed(() => {
  if (!lesson.value) return null;
  return mockModules.find(m => m.id === lesson.value.moduleId) || null;
});

const course = computed(() => {
  if (!module.value) return null;
  return courseStore.getCourseById(module.value.courseId) || null;
});

// Lecciones de módulo
const moduleLessons = computed(() => {
  if (!module.value) return [];
  return courseStore.getLessonsByModuleId(module.value.id).sort((a, b) => a.order - b.order);
});

const currentLessonIndex = computed(() => moduleLessons.value.findIndex(l => l.id === lessonId.value));
const previousLesson = computed(() => currentLessonIndex.value > 0 ? moduleLessons.value[currentLessonIndex.value - 1] : null);
const nextLesson = computed(() => (currentLessonIndex.value >= 0 && currentLessonIndex.value < moduleLessons.value.length - 1) ? moduleLessons.value[currentLessonIndex.value + 1] : null);

// Progreso de la lección
const completedLesson = ref(false);
const markAsCompleted = () => {
  if (!course.value) return;
  completedLesson.value = true;
  courseStore.updateProgress(course.value.id, lessonId.value, true);
};

// Navegación
const navigateToLesson = (id: number) => router.push(`/student/lessons/${id}`);
const goBackToCourse = () => {
  if (course.value) router.push(`/student/courses/${course.value.id}`);
  else router.push('/student/courses');
};

// Reset al cambiar lección
watch(lessonId, () => { completedLesson.value = false; });

// Cuando termina el video
const onVideoEnded = () => {
  if (lesson.value?.type === 'video') markAsCompleted();
};

// Descarga de PDF
const downloadPdf = async () => {
  if (!lesson.value) return;
  try {
    // Extraer solo el nombre del archivo de la ruta
    const fileName = lesson.value.title || "documento";
    
    // Abrir el PDF directamente
    const a = document.createElement('a');
    a.href = lesson.value.content;
    a.download = `${fileName}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    // Marcamos la lección como completada
    if (!completedLesson.value) markAsCompleted();
  } catch (err) {
    console.error('Error al descargar el PDF:', err);
    alert('Error al descargar el PDF');
  }
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="lesson && module && course">
        <!-- Barra de navegación -->
        <div class="flex items-center justify-between mb-6">
          <button @click="goBackToCourse" class="flex items-center text-gray-600 hover:text-primary-600">
            <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al curso
          </button>
          <div class="text-sm text-gray-500">
            {{ course.title }} / {{ module.title }}
          </div>
        </div>

        <!-- Título de la lección -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-900">{{ lesson.title }}</h1>
        </div>

        <!-- Contenido de la lección -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <!-- Video -->
          <div v-if="lesson.type === 'video'" class="aspect-w-16 aspect-h-9">
            <iframe
              class="w-full h-full"
              :src="lesson.content"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              @ended="onVideoEnded"
            ></iframe>
          </div>

          <!-- Texto -->
          <div v-else-if="lesson.type === 'text'" class="p-6">
            <div v-html="lesson.content" class="prose prose-primary max-w-none"></div>
          </div>

          <!-- PDF -->
          <div v-else-if="lesson.type === 'pdf'" class="p-6">
            <div class="flex justify-center mb-4 space-x-4">
              <a :href="lesson.content" target="_blank" class="btn-primary">Abrir PDF</a>
              <button @click="downloadPdf" class="btn-outline">Descargar PDF</button>
            </div>
            <div class="aspect-w-16 aspect-h-9">
              <iframe :src="lesson.content" frameborder="0" class="w-full h-full"></iframe>
            </div>
          </div>
        </div>

        <!-- Navegación entre lecciones -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div v-if="lesson.type !== 'video' && !completedLesson" class="mb-4 md:mb-0">
              <button @click="markAsCompleted" class="btn-secondary">Marcar como completada</button>
            </div>
            <div v-else-if="completedLesson" class="flex items-center text-green-600 mb-4 md:mb-0">
              <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Lección completada
            </div>
            <div class="flex space-x-4">
              <button
                v-if="previousLesson"
                @click="navigateToLesson(previousLesson.id)"
                class="btn-outline flex items-center"
              >
                <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              <button
                v-if="nextLesson"
                @click="navigateToLesson(nextLesson.id)"
                class="btn-primary flex items-center"
              >
                Siguiente
                <svg class="h-5 w-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="h-12 w-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Lección no encontrada</h3>
        <div class="mt-6">
          <router-link to="/student/courses" class="btn-primary">Volver a cursos</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.aspect-w-16 { position: relative; padding-bottom: 56.25%; }
.aspect-w-16 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
.prose { max-width: 65ch; color: #374151; }
.prose h2 { font-weight:700; font-size:1.5em; margin:2em 0 1em; line-height:1.333; }
.prose h3 { font-weight:600; font-size:1.25em; margin:1.6em 0 .6em; line-height:1.6; }
.prose p { margin:1.25em 0; }
</style>