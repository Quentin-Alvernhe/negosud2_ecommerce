<template>
  <v-system-bar color="primary">
    <span>Bienvenue chez NegoSud</span>
    <v-spacer></v-spacer>
    <v-icon icon="mdi mdi-facebook" class="ms-2"></v-icon>
    <v-icon icon="mdi mdi-linkedin" class="ms-2"></v-icon>
    <v-icon icon="mdi mdi-pinterest" class="ms-2"></v-icon>
    <v-icon icon="mdi mdi-twitter" class="ms-2"></v-icon>
    <v-icon icon="mdi mdi-instagram" class="ms-2"></v-icon>
    <v-icon icon="mdi mdi-youtube" class="ms-2"></v-icon>
  </v-system-bar>

  <v-app-bar height="100" flat color="#1F1F1F">
    <v-app-bar-title>
      <h2>
        <v-icon color="primary" size="48" class="mb-2 font-weight-bold">mdi-glass-wine</v-icon> NEGOSUD
      </h2>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Barre de recherche -->
    <v-card color="#141415" flat outlined height="50" width="500" class="mt-6 pt-1">
      <v-row>
        <v-col cols="12" sm="10">
          <v-text-field density="compact" placeholder="Search"></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-icon color="orange" icon="mdi mdi-magnify" size="large" class="mt-2 ml-4"></v-icon>
        </v-col>
      </v-row>
    </v-card>

    <v-spacer></v-spacer>

    <!-- Bouton Panier -->
    <CartButton class="mr-4" />

    <!-- Bouton Mon Compte ou Connexion -->
    <div v-if="authStore.isAuthenticated">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" append-icon="mdi mdi-account">
            Mon Compte
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <template v-slot:title>{{ authStore.user.prenom }} {{ authStore.user.nom }}</template>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <!-- Lien vers la page de compte -->
          <v-list-item to="/account" link>
            <template v-slot:prepend>
              <v-icon>mdi-account-details</v-icon>
            </template>
            <template v-slot:title>Mon profil</template>
          </v-list-item>
          
          <!-- Lien vers les commandes -->
          <v-list-item to="/account/orders" link>
            <template v-slot:prepend>
              <v-icon>mdi-shopping</v-icon>
            </template>
            <template v-slot:title>Mes commandes</template>
          </v-list-item>
          
          <!-- Lien vers les adresses -->
          <v-list-item to="/account/addresses" link>
            <template v-slot:prepend>
              <v-icon>mdi-map-marker</v-icon>
            </template>
            <template v-slot:title>Mes adresses</template>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <!-- Bouton de déconnexion -->
          <v-list-item>
            <v-btn block color="red" @click="logout">Déconnexion</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else>
      <v-btn append-icon="mdi mdi-lock-open-outline" @click="loginDialog = true">
        Connexion
      </v-btn>
    </div>

    <v-divider vertical inset class="mr-6"></v-divider>
  </v-app-bar>

  <v-app-bar height="50" flat color="#191919">
    <v-btn variant="text" color="orange"> Home </v-btn>
    <v-btn variant="text" class="account" to="/shop"> Shop </v-btn>
    <v-btn variant="text" class="account"> Contact Us </v-btn>
    <v-spacer></v-spacer>
    <v-btn density="comfortable" icon="mdi mdi-phone" class="phone mr-2"></v-btn>
    <div>
      <span class="text-caption">Call To</span><br />
      <span class="text-grey text-caption mr-2">1800-231-124</span>
    </div>
  </v-app-bar>

  <!-- Popup de connexion -->
  <v-dialog v-model="loginDialog" max-width="400px">
    <v-card>
      <v-card-title class="headline">Connexion</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
          <v-text-field v-model="password" label="Mot de passe" type="password" required></v-text-field>
        </v-form>
        <!-- Affichage de l'erreur -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="login">Se connecter</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="loginDialog = false">Annuler</v-btn>
      </v-card-actions>
      <v-card-text class="text-center">
        <v-btn variant="text" @click="navigateToRegister">S'inscrire</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import CartButton from '~/components/CartButton.vue';

const authStore = useAuthStore();
const loginDialog = ref(false);
const email = ref('');
const password = ref('');
const errorMessage = ref(''); // Variable pour stocker l'erreur

const login = async () => {
  try {
    errorMessage.value = ''; // Réinitialiser le message d'erreur
    await authStore.login({ email: email.value, motDePasse: password.value });
    loginDialog.value = false;
  } catch (error) {
    console.error("Erreur de connexion", error);
    errorMessage.value = "Identifiants incorrects. Veuillez réessayer."; // Message en cas d'échec
  }
};

const logout = () => {
  authStore.disconnect();
};

const navigateToRegister = () => {
  navigateTo('/register');
};
</script>

<style>
.account {
  transition-duration: 0.4s;
}
.account:hover {
  color: orange;
}
.phone {
  background-color: orange !important;
}
.error-message {
  color: red;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
}
</style>