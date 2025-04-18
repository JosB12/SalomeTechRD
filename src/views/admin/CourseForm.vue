<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/courses';
import { mockUsers } from '@/data/mockData';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();

const isEditMode = computed(() => route.name === 'admin-edit-course');
const courseId = computed(() => isEditMode.value ? parseInt(route.params.id as string) : null);

// Form data
const title = ref('');
const description = ref('');
const objectives = ref<string[]>([]);
const subject = ref('');
const level = ref('');
const thumbnail = ref('');
const trainerId = ref<number | null>(null);
const newObjective = ref('');

// All trainers for the dropdown
const trainers = computed(() => {
  return mockUsers.filter(user => user.role === 'trainer');
});

// Predefined levels
const levels = ['Principiante', 'Intermedio', 'Avanzado'];

// Predefined subjects
const subjects = [
  'Pedagogía', 
  'Tecnología Educativa', 
  'Educación Inclusiva', 
  'Evaluación Educativa',
  'Gestión Educativa',
  'Neurociencia Educativa',
  'Desarrollo Profesional',
  'Curriculum y Metodología'
];

// Load course data if in edit mode
onMounted(() => {
  if (isEditMode.value && courseId.value) {
    const course = courseStore.getCourseById(courseId.value);
    if (course) {
      title.value = course.title;
      description.value = course.description;
      objectives.value = [...course.objectives];
      subject.value = course.subject;
      level.value = course.level;
      thumbnail.value = course.thumbnail;
      trainerId.value = course.trainerId;
    }
  }
});

// Add new objective
const addObjective = () => {
  if (newObjective.value.trim() !== '') {
    objectives.value.push(newObjective.value.trim());
    newObjective.value = '';
  }
};

// Remove objective
const removeObjective = (index: number) => {
  objectives.value.splice(index, 1);
};

// Save course
const saveCourse = () => {
  if (!title.value || !description.value || objectives.value.length === 0 || !subject.value || !level.value || !trainerId.value) {
    alert('Por favor completa todos los campos obligatorios');
    return;
  }
  
  const courseData = {
    trainerId: trainerId.value,
    title: title.value,
    description: description.value,
    objectives: objectives.value,
    subject: subject.value,
    level: level.value,
    thumbnail: thumbnail.value || 'https://placehold.co/600x400'
  };
  
  if (isEditMode.value && courseId.value) {
    // In a real app, this would update the course
    // For the demo, we'll just redirect back
    alert('Curso actualizado correctamente');
    router.push('/admin/courses');
  } else {
    // Add new course
    const newCourseId = courseStore.addCourse(courseData);
    alert('Curso creado correctamente');
    router.push('/admin/courses');
  }
};

// Cancel and go back
const cancel = () => {
  router.push('/admin/courses');
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-8 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso' }}
            </h1>
            <p class="mt-1 text-gray-500">
              {{ isEditMode ? 'Modifica la información del curso' : 'Completa el formulario para crear un nuevo curso' }}
            </p>
          </div>
          <button @click="cancel" class="text-gray-600 hover:text-gray-900">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form @submit.prevent="saveCourse" class="space-y-6">
          <!-- Basic course info -->
          <div>
            <label for="title" class="form-label">Título <span class="text-red-500">*</span></label>
            <input
              id="title"
              type="text"
              v-model="title"
              placeholder="Introduce el título del curso"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label for="description" class="form-label">Descripción <span class="text-red-500">*</span></label>
            <textarea
              id="description"
              v-model="description"
              rows="4"
              placeholder="Describe el contenido y beneficios del curso"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
              required
            ></textarea>
          </div>
          
          <div>
            <label class="form-label">Objetivos <span class="text-red-500">*</span></label>
            <div class="mb-2">
              <div class="flex">
                <input
                  type="text"
                  v-model="newObjective"
                  placeholder="Añadir nuevo objetivo"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
                />
                <button
                  type="button"
                  @click="addObjective"
                  class="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700"
                >
                  Añadir
                </button>
              </div>
            </div>
            
            <div v-if="objectives.length === 0" class="text-sm text-red-500">
              Añade al menos un objetivo para el curso
            </div>
            
            <ul class="space-y-2 ml-4">
              <li v-for="(objective, index) in objectives" :key="index" class="flex items-center">
                <span class="h-2 w-2 bg-primary-600 rounded-full mr-2"></span>
                <span class="flex-grow">{{ objective }}</span>
                <button
                  type="button"
                  @click="removeObjective(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="subject" class="form-label">Categoría <span class="text-red-500">*</span></label>
              <select
                id="subject"
                v-model="subject"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
                required
              >
                <option value="" disabled>Selecciona una categoría</option>
                <option v-for="subj in subjects" :key="subj" :value="subj">
                  {{ subj }}
                </option>
              </select>
            </div>
            
            <div>
              <label for="level" class="form-label">Nivel <span class="text-red-500">*</span></label>
              <select
                id="level"
                v-model="level"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
                required
              >
                <option value="" disabled>Selecciona un nivel</option>
                <option v-for="lvl in levels" :key="lvl" :value="lvl">
                  {{ lvl }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="thumbnail" class="form-label">URL de imagen (opcional)</label>
            <input
              id="thumbnail"
              type="text"
              v-model="thumbnail"
              placeholder="https://example.com/image.jpg"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
            />
            <p class="mt-1 text-sm text-gray-500">
              Deja en blanco para usar una imagen por defecto
            </p>
          </div>
          
          <div>
            <label for="trainer" class="form-label">Capacitador <span class="text-red-500">*</span></label>
            <select
              id="trainer"
              v-model="trainerId"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm"
              required
            >
              <option value="" disabled>Selecciona un capacitador</option>
              <option v-for="trainer in trainers" :key="trainer.id" :value="trainer.id">
                {{ trainer.name }}
              </option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button type="button" @click="cancel" class="btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditMode ? 'Guardar cambios' : 'Crear curso' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>