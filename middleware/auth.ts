import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  
  // Vérifier si l'utilisateur est authentifié
  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion
    return navigateTo('/login');
  }
});