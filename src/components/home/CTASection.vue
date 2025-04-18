<script setup lang="ts">
</script>

<template>
  <section class="py-16 bg-accent-500 relative overflow-hidden">
    <div class="absolute inset-0 opacity-20">
      <svg class="h-full w-full" fill="none">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white"></circle>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"></rect>
      </svg>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          ¿Listo para transformar tu enseñanza?
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-white text-opacity-80">
          Únete a miles de educadores que están mejorando sus habilidades y transformando la vida de sus estudiantes.
        </p>
        <div class="mt-10">
          <router-link to="/register" class="btn bg-white text-accent-600 hover:bg-gray-100 focus:ring-accent-500 text-lg px-8 py-3">
            Comenzar Ahora
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>