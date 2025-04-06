import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore(); // Utilisation de votre store Pinia

  // Surcharge de `$fetch` pour inclure le token
  const originalFetch = $fetch;

  nuxtApp.provide("fetchWithAuth", (input: RequestInfo, init: any = {}) => {
    if (authStore.token) {
      init.headers = {
        ...init.headers,
        Authorization: `Bearer ${authStore.token}`, // Injecte le token
      };
    }

    // S'assurer que les types sont conformes aux attentes de $fetch
    if (init.method && typeof init.method === "string") {
      init.method = init.method.toUpperCase();
    }

    return originalFetch(input, init);
  });

});
