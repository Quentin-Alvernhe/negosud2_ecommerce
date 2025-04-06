<script setup lang="ts">
import { useDisplay } from 'vuetify'
definePageMeta({
  middleware: ['authenticated'],
})

const { user, clear: clearSession } = useUserSession()

// Accéder aux points de rupture
const { smAndDown } = useDisplay()

// Titre de l'application
const appTitle = 'NegoSud'

// État pour le menu latéral (mobile uniquement)
const sidebar = ref(false)

// Éléments du menu de navigation
const menuItems = [
  { title: 'Stock', path: '/stock', icon: 'mdi-warehouse' },
  { title: 'Produit', path: '/produit', icon: 'mdi-package-variant' },
  { title: 'Famille', path: '/famille', icon: 'mdi-folder' },
  { title: 'Réassort', path: '/reassort', icon: 'mdi-cart-arrow-down' },
  { title: 'Commande Client', path: '/commande-client', icon: 'mdi-account-box' },
  { title: 'Fournisseur', path: '/fournisseur', icon: 'mdi-truck' },
  { title: 'Utilisateur', path: '/utilisateur', icon: 'mdi-account' },
]

// Fonction pour gérer la déconnexion
async function logout() {
  await clearSession()
  await navigateTo('/login')
  console.log('Déconnexion effectuée')
}
</script>

<template>
  <v-app>
    <!-- Barre de navigation -->
    <v-app-bar app dense color="primary" dark>
      <!-- Titre -->
      <v-toolbar-title><v-icon>mdi-glass-wine </v-icon>{{ appTitle }}</v-toolbar-title>

      <v-spacer />

      <!-- Liens pour les grands écrans -->
      <template v-if="!smAndDown">
        <v-toolbar-items>
          <v-btn
            v-for="item in menuItems"
            :key="item.title"
            :to="item.path"
            text
            color="white"
          >
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
          <v-btn>
            <v-icon left>mdi-account</v-icon> {{ user.name }}
          </v-btn>
        </v-toolbar-items>
        <!-- Bouton de déconnexion -->
        <v-btn  text color="red" @click="logout">Déconnexion</v-btn>
      </template>

      <!-- Icône pour ouvrir le menu latéral sur mobile -->
      <v-app-bar-nav-icon 
        v-else
        @click="sidebar = !sidebar"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <!-- Menu déroulant pour mobile -->
    <v-navigation-drawer 
      v-model="sidebar" 
      app 
      temporary
    >
      <v-list>
           <!-- Affichage de l'icône de profil et du nom -->
           <v-list-item>
          
             <v-icon>mdi-account</v-icon>{{ user.name }}
          
        </v-list-item>
        <!-- Liens du menu -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
        >
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.title }}
        </v-list-item>

        <!-- Bouton de déconnexion -->
        <v-list-item>
          <v-btn block text color="red" @click="logout">Déconnexion</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenu principal -->
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
