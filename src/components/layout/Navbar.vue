<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRole = computed(() => authStore.userRole);
const user = computed(() => authStore.user);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeMenu();
};

const getDashboardLink = computed(() => {
  if (userRole.value === 'student') return '/student';
  if (userRole.value === 'trainer') return '/trainer';
  if (userRole.value === 'admin') return '/admin';
  return '/';
});
</script>

<template>
  <header class="bg-white shadow-sm fixed w-full top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and site name -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <span class="text-primary-600 font-bold text-xl md:text-2xl">
                SalomeTechRD</span>
            </router-link>
          </div>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
          <router-link to="/" class="px-3 py-2 text-gray-700 hover:text-primary-600">
            Inicio
          </router-link>
          
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="px-3 py-2 text-gray-700 hover:text-primary-600">
              Iniciar Sesión
            </router-link>
            <router-link to="/register" class="btn-primary">
              Registrarse
            </router-link>
          </template>
          
          <template v-else>
            <router-link :to="getDashboardLink" class="px-3 py-2 text-gray-700 hover:text-primary-600">
              Panel
            </router-link>
            
            <!-- User dropdown -->
            <div class="ml-3 relative">
              <div>
                <button @click="toggleMenu" class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <span class="sr-only">Abrir menú de usuario</span>
                  <img class="h-8 w-8 rounded-full" :src="user?.avatar" alt="Foto de perfil">
                </button>
              </div>
              
              <!-- Dropdown menu -->
              <div v-if="isMenuOpen" 
                   class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <p class="font-medium">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>
                <router-link :to="getDashboardLink" @click="closeMenu" 
                             class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mi Panel
                </router-link>
                <a href="#" @click.prevent="handleLogout" 
                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMenu" 
                  class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
            <span class="sr-only">Abrir menú</span>
            <!-- Icon when menu is closed -->
            <svg v-if="!isMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon when menu is open -->
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/" @click="closeMenu" 
                     class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
          Inicio
        </router-link>
        
        <template v-if="!isAuthenticated">
          <router-link to="/login" @click="closeMenu" 
                       class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
            Iniciar Sesión
          </router-link>
          <router-link to="/register" @click="closeMenu" 
                       class="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-gray-50">
            Registrarse
          </router-link>
        </template>
        
        <template v-else>
          <router-link :to="getDashboardLink" @click="closeMenu" 
                       class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
            Panel
          </router-link>
          <a href="#" @click.prevent="handleLogout" 
             class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">
            Cerrar Sesión
          </a>
        </template>
      </div>
      
      <!-- User info in mobile menu -->
      <div v-if="isAuthenticated" class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" :src="user?.avatar" alt="Foto de perfil">
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user?.name }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Spacer to prevent content from being hidden behind fixed header -->
  <div class="h-16"></div>
</template>