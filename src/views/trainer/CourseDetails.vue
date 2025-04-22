<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
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

// Estudiantes y recordatorios
const students = computed(() => courseStore.getStudentsByCourseId(courseId.value));
const selectedStudents = ref<number[]>([]);
const selectAllStudents = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  selectedStudents.value = checked ? students.value.map(s => s.userId) : [];
};
const toggleStudentSelection = (userId: number) => {
  const idx = selectedStudents.value.indexOf(userId);
  if (idx === -1) selectedStudents.value.push(userId);
  else selectedStudents.value.splice(idx, 1);
};
const sendReminders = () => {
  if (!selectedStudents.value.length) return alert('Selecciona al menos un estudiante.');
  alert(`Recordatorios enviados a ${selectedStudents.value.length} estudiantes.`);
  selectedStudents.value = [];
};

// Crear módulos
const newModule = reactive({ title: '', description: '', order: 1 });
const addModule = () => {
  if (!newModule.title.trim()) return alert('Título de módulo requerido');
  courseStore.addModule({
    courseId: courseId.value,
    title: newModule.title,
    description: newModule.description,
    order: newModule.order,
  });
  newModule.title = '';
  newModule.description = '';
  newModule.order++;
};

// Crear lecciones
const newLessons = reactive<Record<number, { title: string; type: string; content: string; duration: number; order: number }>>({});
const getLessonForm = (mid: number) => {
  if (!newLessons[mid]) {
    newLessons[mid] = { title: '', type: 'video', content: '', duration: 0, order: 1 };
  }
  return newLessons[mid];
};
const addLessonTo = (mid: number) => {
  const form = getLessonForm(mid);
  if (!form.title.trim()) return alert('Título de lección requerido');
  courseStore.addLesson({
    moduleId: mid,
    title: form.title,
    type: form.type,
    content: form.content,
    duration: form.duration,
    order: form.order,
  });
  form.title = '';
  form.content = '';
  form.duration = 0;
  form.order++;
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="course">
        <!-- Header Curso -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="relative h-64">
            <img :src="course.thumbnail" class="w-full h-full object-cover" :alt="course.title" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <div class="flex flex-wrap gap-2 mb-2">
                <span class="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">{{ course.level }}</span>
                <span class="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">{{ course.subject }}</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-white">{{ course.title }}</h1>
            </div>
          </div>
        </div>

        <!-- Formulario Nuevo Módulo -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h3 class="font-semibold mb-2">Agregar nuevo módulo</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input v-model="newModule.title" placeholder="Título del módulo" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
            <input v-model="newModule.description" placeholder="Descripción" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
            <input type="number" v-model.number="newModule.order" min="1" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
          </div>
          <button @click="addModule" class="btn-primary mt-3">Añadir módulo</button>
        </div>

        <!-- Lista Estudiantes y Recordatorios -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Estudiantes inscritos</h2>
            <button v-if="selectedStudents.length" @click="sendReminders" class="btn-primary">
              Enviar recordatorio ({{ selectedStudents.length }})
            </button>
          </div>
          <div v-if="!students.length" class="p-8 text-center text-gray-500">
            No hay estudiantes inscritos aún.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3"><input type="checkbox" @change="selectAllStudents" :checked="selectedStudents.length === students.length" class="h-4 w-4"/></th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última actividad</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="s in students" :key="s.userId">
                  <td class="px-6 py-4 whitespace-nowrap"><input type="checkbox" :checked="selectedStudents.includes(s.userId)" @change="toggleStudentSelection(s.userId)" class="h-4 w-4"/></td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ s.userId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ s.progress }}%</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(s.lastActivity).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Contenido del Curso: Módulos y Lecciones -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Contenido del curso</h2>
          <div v-if="!modules.length" class="text-center py-8 text-gray-500">
            Este curso no tiene módulos aún.
          </div>
          <div v-else class="space-y-6">
            <div v-for="module in modules" :key="module.id" class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 p-4 border-b border-gray-200">
                <h3 class="font-medium text-gray-900">{{ module.title }}</h3>
                <p class="text-sm text-gray-500">{{ module.description }}</p>
              </div>
              <!-- Formulario Nueva Lección -->
              <div class="p-4 bg-gray-50">
                <h4 class="font-medium mb-2">Agregar lección a "{{ module.title }}"</h4>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input v-model="getLessonForm(module.id).title" placeholder="Título" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
                  <select v-model="getLessonForm(module.id).type" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm">
                    <option value="video">Video</option>
                    <option value="text">Texto</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <input v-model="getLessonForm(module.id).content" placeholder="URL o contenido" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
                  <input type="number" v-model.number="getLessonForm(module.id).duration" min="0" placeholder="Duración" class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
                </div>
                <div class="flex items-center gap-3 mt-2">
                  <input type="number" v-model.number="getLessonForm(module.id).order" min="1" placeholder="Orden" class="w-20 block  px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
                  <button @click="addLessonTo(module.id)" class="btn-secondary">Añadir lección</button>
                </div>
              </div>
              <!-- Lista Lecciones Existentes -->
              <div class="divide-y divide-gray-200">
                <div v-for="lesson in courseStore.getLessonsByModuleId(module.id)" :key="lesson.id" class="p-4 flex items-center">
                  <div class="h-10 w-10 flex items-center justify-center rounded-full" :class="{
                    'bg-primary-100 text-primary-600': lesson.type==='video',
                    'bg-accent-100 text-accent-600': lesson.type==='text',
                    'bg-secondary-100 text-secondary-600': lesson.type==='pdf'
                  }">
                    <svg v-if="lesson.type==='video'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                    <svg v-else-if="lesson.type==='text'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">{{ lesson.title }}</h4>
                    <p class="text-xs text-gray-500">{{ lesson.type }} • {{ lesson.duration }} min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-900">
        Curso no encontrado.
        <router-link to="/trainer/courses" class="btn-primary mt-4 inline-block">Volver</router-link>
      </div>
    </div>
  </div>
</template>