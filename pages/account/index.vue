<template>
    <v-container>
      <h1 class="text-h4 mb-6">Mon compte</h1>
      
      <v-row>
        <!-- Informations personnelles -->
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              Informations personnelles
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center mb-4">
                <v-avatar size="80" color="primary" class="mr-4">
                  <v-img v-if="userPhotoUrl" :src="userPhotoUrl"></v-img>
                  <span v-else class="text-h4 text-white">{{ userInitials }}</span>
                </v-avatar>
                <div>
                  <h3 class="text-h6">{{ authStore.user.prenom }} {{ authStore.user.nom }}</h3>
                  <p class="text-subtitle-1 mb-0">{{ authStore.user.email }}</p>
                </div>
              </div>
              
              <v-list>
                <v-list-item prepend-icon="mdi-email">
                    <template v-slot:title>Email</template>
                    <template v-slot:subtitle>{{ authStore.user.email }}</template>
                </v-list-item>
                
                <v-divider></v-divider>
                
                <v-list-item prepend-icon="mdi-phone">
                    <template v-slot:title>Téléphone</template>
                    <template v-slot:subtitle>{{ userPhone || 'Non renseigné' }}</template>
                </v-list-item>
                </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Liens utiles -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-link</v-icon>
              Liens utiles
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  prepend-icon="mdi-map-marker"
                  title="Mes adresses"
                  to="/account/addresses"
                ></v-list-item>
                
                <v-divider></v-divider>
                
                <v-list-item
                  prepend-icon="mdi-shopping"
                  title="Mes commandes"
                  to="/account/orders"
                ></v-list-item>
                
                <v-divider></v-divider>
                
                <v-list-item
                  prepend-icon="mdi-cart"
                  title="Mon panier"
                  @click="openCartModal"
                ></v-list-item>
                
                <v-divider></v-divider>
                
                <v-list-item
                  prepend-icon="mdi-logout"
                  title="Déconnexion"
                  @click="logout"
                  color="error"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Résumé des dernières commandes -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-history</v-icon>
              Dernières commandes
            </v-card-title>
            <v-card-text>
              <div v-if="isLoading" class="text-center py-4">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              
              <div v-else-if="recentOrders.length > 0">
                <v-table>
                  <thead>
                    <tr>
                      <th>Numéro</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in recentOrders" :key="order.id">
                      <td>{{ order.numeroCommande }}</td>
                      <td>{{ formatDate(order.horodatageCreationCommande) }}</td>
                      <td>
                        <v-chip
                          :color="getStatusColor(order.statutCommande)"
                          size="small"
                        >
                          {{ getStatusLabel(order.statutCommande) }}
                        </v-chip>
                      </td>
                      <td>{{ order.prixTotal.toFixed(2) }} €</td>
                      <td>
                        <v-btn
                          size="small"
                          variant="text"
                          color="primary"
                          to="/account/orders"
                        >
                          Détails
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                
                <div class="text-center mt-4">
                  <v-btn color="primary" variant="text" to="/account/orders">
                    Voir toutes mes commandes
                  </v-btn>
                </div>
              </div>
              
              <div v-else class="text-center py-4">
                <p>Vous n'avez pas encore passé de commande.</p>
                <v-btn color="primary" class="mt-2" to="/shop">
                  Explorer nos produits
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '~/stores/auth';
  import { useOrders } from '~/composables/useOrders';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const authStore = useAuthStore();
  const { orders, isLoading, fetchOrders } = useOrders();
  
  // Informations utilisateur
  const userPhone = ref('');
  const userPhotoUrl = ref('');
  
  // Calculer les initiales de l'utilisateur pour l'avatar
  const userInitials = computed(() => {
    const firstName = authStore.user.prenom || '';
    const lastName = authStore.user.nom || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  });
  
  // Récupérer les 5 dernières commandes
  const recentOrders = computed(() => {
    return [...orders.value]
      .sort((a, b) => {
        // Tri par date de création (de la plus récente à la plus ancienne)
        const dateA = new Date(a.horodatageCreationCommande[0], a.horodatageCreationCommande[1] - 1, a.horodatageCreationCommande[2]).getTime();
        const dateB = new Date(b.horodatageCreationCommande[0], b.horodatageCreationCommande[1] - 1, b.horodatageCreationCommande[2]).getTime();
        return dateB - dateA;
      })
      .slice(0, 5); // Prendre les 5 premières commandes
  });
  
  // Fonction pour formater la date
  const formatDate = (dateArray: any) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return "Date inconnue";
    }
  
    try {
      const [year, month, day] = dateArray;
      const date = new Date(year, month - 1, day);
      
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (error) {
      console.error("Erreur lors de la conversion de la date :", error);
      return "Date invalide";
    }
  };
  
  // Fonction pour obtenir l'étiquette du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CREE':
        return 'Créée';
      case 'PREPARATION':
        return 'En préparation';
      case 'LIVRAISON':
        return 'En livraison';
      case 'LIVRE':
        return 'Livrée';
      case 'RETOUR':
        return 'Retournée';
      case 'ANNULE':
        return 'Annulée';
      default:
        return status;
    }
  };
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREE':
        return 'blue';
      case 'PREPARATION':
        return 'indigo';
      case 'LIVRAISON':
        return 'orange';
      case 'LIVRE':
        return 'success';
      case 'RETOUR':
        return 'purple';
      case 'ANNULE':
        return 'error';
      default:
        return 'grey';
    }
  };
  
  // Ouvrir la modal du panier
  const openCartModal = () => {
    // Cette fonction nécessite d'accéder à la ref cartModal du composant CartButton
    // Une solution alternative serait d'utiliser un événement global ou un état dans un store
    router.push('/shop');
  };
  
  // Déconnexion
  const logout = () => {
    authStore.disconnect();
    router.push('/');
  };
  
  onMounted(async () => {
    await fetchOrders();
  });
  </script>