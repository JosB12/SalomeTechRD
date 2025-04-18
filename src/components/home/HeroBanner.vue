<script setup lang="ts">
</script>

<template>
  <div class="parallax-container">
    <div class="parallax-layer parallax-layer-back">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-600 opacity-90"></div>
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
    </div>
    <div class="parallax-layer parallax-layer-base">
      <div class="flex items-center justify-center min-h-screen px-4 py-32 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span class="block">Capacitación Docente</span>
            <span class="block text-accent-400">para el Aula del Futuro</span>
          </h1>
          <p class="mt-6 text-xl text-white max-w-3xl mx-auto">
            Formamos educadores para transformar la educación. Cursos especializados diseñados por expertos en pedagogía y tecnología educativa.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/register" class="btn-accent text-lg px-8 py-3">
              Comenzar Ahora
            </router-link>
            <a href="#features" class="btn bg-white text-primary-800 hover:bg-gray-100 focus:ring-primary-400 text-lg px-8 py-3">
              Conocer Más
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parallax-container {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  perspective: 1px;
}

.parallax-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.parallax-layer-back {
  transform: translateZ(-1px) scale(2);
}

.parallax-layer-base {
  transform: translateZ(0);
}
</style>