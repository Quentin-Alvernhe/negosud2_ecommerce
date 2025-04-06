<template>
  <v-container class="d-flex align-center justify-center flex-column" style="height: 100vh;">
    <!-- Titre et icône en dehors du formulaire -->
    <div class="text-center mb-6">
      <v-icon color="primary" size="48" class="mb-2 font-weight-bold">mdi-glass-wine</v-icon>
      <h1 class="text-h4 font-weight-bold text-primary">NEGOSUD</h1>
    </div>

    <!-- Formulaire -->
    <v-sheet class="mx-auto pa-4" width="400" elevation="3" rounded>
      <div class="text-center mt-2">
        <h2 class="text-h5 font-weight-bold text-primary">Connexion</h2>
        <p class="text-subtitle-2 text-primary">Veuillez vous connecter</p>
      </div>

      <v-form @submit.prevent="login" class="mt-4">
        <!-- Champ Email -->
        <v-text-field
          v-model="userCredentials.email"
          label="Email"
          type="email"
          outlined
          required
        />

        <!-- Champ Mot de Passe -->
        <v-text-field
          v-model="userCredentials.password"
          label="Mot de passe"
          :type="isPasswordVisible ? 'text' : 'password'"
          outlined
          required
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />

        <!-- Message d'erreur -->
        <v-alert v-if="loginError" type="error" dense text class="mt-2">
          {{ loginError }}
        </v-alert>

        <!-- Bouton de connexion -->
        <v-btn type="submit" color="primary" block :loading="isLoading" class="mt-4">
          Se connecter
        </v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const userCredentials = reactive({
  email: "",
  password: "",
});

const isLoading = ref(false);
const isPasswordVisible = ref(false);
const loginError = ref("");

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const router = useRouter();

const login = async () => {
  try {
    isLoading.value = true;
    loginError.value = ""; // Reset error message
    await authStore.login({
      email: userCredentials.email,
      motDePasse: userCredentials.password,
    });

    if (isAuthenticated.value) {
      router.push("/home");
    } else {
      loginError.value = "Connexion échouée. Vérifiez vos identifiants.";
    }
  } catch (error) {
    loginError.value = "Erreur d'authentification. Identifiants incorrects.";
  } finally {
    isLoading.value = false;
  }
};
</script>
