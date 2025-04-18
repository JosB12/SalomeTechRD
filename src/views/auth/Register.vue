<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('student');
const termsAccepted = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSubmit = async () => {
  // Reset error
  errorMessage.value = '';

  // Validate fields
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Todos los campos son obligatorios';
    return;
  }

  if (!validateEmail(email.value)) {
    errorMessage.value = 'Ingresa un correo electrónico válido';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  if (!termsAccepted.value) {
    errorMessage.value = 'Debes aceptar los términos y condiciones';
    return;
  }

  // Submit form
  isLoading.value = true;

  const success = await authStore.register(
    name.value,
    email.value,
    password.value,
    role.value as any
  );

  isLoading.value = false;

  if (!success) {
    errorMessage.value = 'Error al registrar el usuario. El correo electrónico ya podría estar en uso.';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Crea tu cuenta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Inicia sesión
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
            <label for="name" class="form-label">
              Nombre completo
            </label>
            <div class="mt-1">
              <input id="name" name="name" type="text" autocomplete="name" required
                     v-model="name"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="email" class="form-label">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required
                     v-model="email"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="form-label">
              Contraseña
            </label>
            <div class="mt-1">
              <input id="password" name="password" type="password" autocomplete="new-password" required
                     v-model="password"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="form-label">
              Confirmar contraseña
            </label>
            <div class="mt-1">
              <input id="confirm-password" name="confirm-password" type="password" required
                     v-model="confirmPassword"
                     class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="role" class="form-label">
              Registrarme como
            </label>
            <div class="mt-1">
              <select id="role" name="role" 
                      v-model="role"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md
           bg-white text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-primary-500 sm:text-sm">
                <option value="student">Estudiante (Maestro)</option>
                <option value="trainer">Capacitador</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <input id="terms" name="terms" type="checkbox" required
                   v-model="termsAccepted"
                   class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              Acepto los <a href="#" class="text-primary-600 hover:text-primary-500">términos y condiciones</a>
            </label>
          </div>

          <div>
            <button type="submit" 
                    :disabled="isLoading"
                    class="btn-primary w-full flex justify-center">
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>