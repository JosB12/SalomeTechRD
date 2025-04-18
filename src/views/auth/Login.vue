<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor ingresa tu correo y contraseña';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  const success = await authStore.login(email.value, password.value);

  isLoading.value = false;

  if (!success) {
    errorMessage.value = 'Correo o contraseña incorrectos';
  }
};

// Testing credentials helper
const loginAsStudent = () => {
  email.value = 'student@example.com';
  password.value = 'password';
};

const loginAsTrainer = () => {
  email.value = 'trainer@example.com';
  password.value = 'password';
};

const loginAsAdmin = () => {
  email.value = 'admin@example.com';
  password.value = 'password';
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Inicia sesión en tu cuenta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?
        <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          Regístrate
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ errorMessage }}
                </h3>
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="form-label">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required
                     v-model="email"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900
         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500
         focus:border-primary-500 sm:text-sm"/>
            </div>
          </div>

          <div>
            <label for="password" class="form-label">
              Contraseña
            </label>
            <div class="mt-1">
              <input id="password" name="password" type="password" autocomplete="current-password" required
                     v-model="password"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900
         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500
         focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                     v-model="rememberMe"
                     class="h-4 w-4 border border-gray-300 rounded bg-white
                            checked:bg-primary-600 checked:border-transparent
                            focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
                Olvidé mi contraseña
              </router-link>
            </div>
          </div>

          <div>
            <button type="submit" 
                    :disabled="isLoading"
                    class="btn-primary w-full flex justify-center">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciar sesión
            </button>
          </div>
        </form>

        <!-- Demo login buttons (for the project example only) -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Cuentas de demostración
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              class="px-2 py-2 text-xs border border-gray-300 bg-white rounded-md hover:bg-gray-50"
              @click="loginAsStudent"
            >
              Estudiante
            </button>
            <button
              type="button"
              class="px-2 py-2 text-xs border border-gray-300 bg-white rounded-md hover:bg-gray-50"
              @click="loginAsTrainer"
            >
              Capacitador
            </button>
            <button
              type="button"
              class="px-2 py-2 text-xs border border-gray-300 bg-white rounded-md hover:bg-gray-50"
              @click="loginAsAdmin"
            >
              Administrador
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>