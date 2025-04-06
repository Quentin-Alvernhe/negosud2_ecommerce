import axios from "axios";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: "http://localhost:8080/api",
  });

  // Ajouter un intercepteur pour injecter le token
  instance.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();

      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: instance,
    },
  };
});
