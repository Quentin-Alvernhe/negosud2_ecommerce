<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useAuthStore } from "~/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import AppBar from "~/components/AppBar.vue";

// Accéder aux points de rupture
const { smAndDown } = useDisplay();
const router = useRouter();
const route = useRoute();

// Titre de l'application
const appTitle = "NEGOSUD";

// État pour le menu latéral (mobile uniquement)
//const sidebar = ref(false);

// Récupérer les infos de l'utilisateur
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);


</script>

<template>
  <v-app>
    <!-- Barre de navigation -->
    <AppBar/>

   
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
