<script setup lang="ts">
const testimonials = [
  {
    id: 1,
    content: "La calidad de los cursos y el enfoque práctico me han permitido transformar mi metodología de enseñanza. Mis estudiantes están más comprometidos que nunca.",
    author: "Laura Martínez",
    role: "Profesora de Secundaria",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    content: "Como director escolar, he visto un cambio significativo en los docentes que han tomado estos cursos. El rendimiento académico de nuestros alumnos ha mejorado considerablemente.",
    author: "Miguel Álvarez",
    role: "Director de Escuela Primaria",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 3,
    content: "La flexibilidad de la plataforma me permitió completar mi capacitación mientras trabajaba tiempo completo. Los conocimientos adquiridos son invaluables.",
    author: "Carolina Flores",
    role: "Docente de Educación Especial",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  }
]
</script>

<template>
  <section class="py-24 bg-primary-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-extrabold sm:text-4xl">
          Lo que dicen nuestros usuarios
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-primary-200">
          Historias de éxito de educadores que han transformado su práctica docente.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div v-for="testimonial in testimonials" :key="testimonial.id" 
             class="bg-primary-800 rounded-xl p-8 shadow-md transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <div class="flex items-center mb-6">
            <img :src="testimonial.avatar" alt="Foto de perfil" class="h-12 w-12 rounded-full">
            <div class="ml-4">
              <h4 class="font-semibold">{{ testimonial.author }}</h4>
              <p class="text-primary-300 text-sm">{{ testimonial.role }}</p>
            </div>
          </div>
          <svg class="h-8 w-8 text-primary-600 mb-4" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p class="text-primary-100 italic">{{ testimonial.content }}</p>
        </div>
      </div>
    </div>
  </section>
</template>