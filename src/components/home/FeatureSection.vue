<script setup lang="ts">
const features = [
  {
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 016.824-2.998 12.078 12.078 0 00-.665-6.479L12 14z',
    title: 'Cursos de Alta Calidad',
    description: 'Contenido pedagógico actualizado y práctico, desarrollado por expertos en educación.'
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Certificaciones Reconocidas',
    description: 'Obtén certificados validados que respaldarán tu desarrollo profesional como docente.'
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Aprendizaje Flexible',
    description: 'Accede a los contenidos cuando y donde quieras, adaptándose a tu ritmo y horario.'
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Comunidad de Educadores',
    description: 'Forma parte de una red de profesionales donde compartir experiencias y mejores prácticas.'
  }
]
</script>

<template>
  <section id="features" class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          ¿Por qué elegir TeachWell?
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Ofrecemos una experiencia de capacitación integral diseñada para el docente moderno.
        </p>
      </div>

      <div class="mt-20">
        <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="(feature, index) in features" :key="index" 
               class="bg-white rounded-xl shadow-md p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div class="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon" />
              </svg>
            </div>
            <h3 class="mt-6 text-xl font-medium text-gray-900 text-center">{{ feature.title }}</h3>
            <p class="mt-4 text-base text-gray-500 text-center">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>