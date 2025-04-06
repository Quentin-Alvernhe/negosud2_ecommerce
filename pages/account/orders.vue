<template>
    <v-container>
      <h1 class="text-h4 mb-6">Mes commandes</h1>
      
      <div v-if="isLoading" class="d-flex justify-center my-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <div v-else>
        <div v-if="orders.length > 0">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="order in orders"
              :key="order.id"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <div>
                    <strong>Commande #{{ order.numeroCommande }}</strong>
                    <div class="text-caption">
                      {{ formatDate(order.horodatageCreationCommande) }}
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-chip
                    :color="getStatusColor(order.statutCommande)"
                    class="ml-4"
                  >
                    {{ getStatusLabel(order.statutCommande) }}
                  </v-chip>
                  <div class="text-right ml-4">
                    <strong>{{ order.prixTotal.toFixed(2) }} €</strong>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title>Adresse de livraison</v-card-title>
                      <v-card-text>
                        <p class="mb-0">{{ order.adresseLivraison?.numeroBatiment || '' }} {{ order.adresseLivraison?.nomRue || '' }}</p>
                        <p v-if="order.adresseLivraison?.numeroAppartement" class="mb-0">
                          Appartement {{ order.adresseLivraison.numeroAppartement }}
                        </p>
                        <p>{{ order.adresseLivraison?.codePostal || '' }} {{ order.adresseLivraison?.nomVille || '' }}</p>
                      </v-card-text>
                    </v-card>
                    
                    <v-card variant="outlined">
                      <v-card-title>Adresse de facturation</v-card-title>
                      <v-card-text>
                        <p class="mb-0">{{ order.adresseFacturation?.numeroBatiment || '' }} {{ order.adresseFacturation?.nomRue || '' }}</p>
                        <p v-if="order.adresseFacturation?.numeroAppartement" class="mb-0">
                          Appartement {{ order.adresseFacturation.numeroAppartement }}
                        </p>
                        <p>{{ order.adresseFacturation?.codePostal || '' }} {{ order.adresseFacturation?.nomVille || '' }}</p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-card variant="outlined">
                      <v-card-title>Produits commandés</v-card-title>
                      <v-card-text>
                        <v-list>
                            <v-list-item
                                v-for="(line, index) in order.lignesCommandeClient"
                                :key="index"
                            >
                                <template v-slot:prepend>
                                <span class="text-body-2 mr-2">{{ line.quantite }}x</span>
                                </template>
                                <template v-slot:title>
                                {{ getProductName(line) || 'Produit' }}
                                </template>
                                <template v-slot:subtitle>
                                {{ getPrixUnitaire(line).toFixed(2) }} €
                                </template>
                            </v-list-item>
                            </v-list>
                        
                        <v-divider class="my-4"></v-divider>
                        
                        <div class="d-flex justify-space-between">
                          <div class="text-h6">Total</div>
                          <div class="text-h6">{{ order.prixTotal.toFixed(2) }} €</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        
        <div v-else class="text-center my-8">
          <v-icon size="64" color="grey lighten-1">mdi-cart-off</v-icon>
          <p class="mt-4 text-body-1">Vous n'avez pas encore passé de commande.</p>
          <v-btn color="primary" class="mt-4" to="/shop">
            Explorer nos produits
          </v-btn>
        </div>
      </div>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useOrders } from '~/composables/useOrders';
  import { useProducts } from '~/composables/useProducts';
  import type { OrderLine } from '~/types/Order';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const { orders, isLoading, fetchOrders } = useOrders();
  const { products, fetchProducts } = useProducts();
  
  // Fonction pour formater la date
  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Date inconnue";
    
    try {
      // Si la date est un tableau [année, mois, jour, ...]
      if (Array.isArray(dateValue) && dateValue.length >= 3) {
        const [year, month, day, hour, minute] = dateValue;
        const date = new Date(year, month - 1, day, hour || 0, minute || 0);
        
        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      
      // Si la date est une chaîne de caractères ou un autre format
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      
      return "Format de date inconnu";
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
  
  // Fonction pour obtenir le nom du produit à partir de la ligne de commande
  const getProductName = (line: OrderLine) => {
  // Vérifier si l'information est disponible via prixHistorique
  if (line.prixHistorique && line.prixHistorique.article && line.prixHistorique.article.nom) {
    return line.prixHistorique.article.nom;
  }
  
  // Si l'article a un nom directement
  if (line.article && line.article.nom) {
    return line.article.nom;
  }
  
  // Sinon, chercher dans les produits par ID
  if (line.article && line.article.id) {
    const product = products.value.find(p => p.id === line.article.id);
    return product ? product.nom : "Produit inconnu";
  }
  
  return "Produit inconnu";
};
  
  // Fonction pour obtenir le prix unitaire d'une ligne de commande
  const getPrixUnitaire = (line: OrderLine) => {
    // Vérifier si le prix unitaire est directement disponible
    if (line.prixUnitaire !== undefined) {
      return line.prixUnitaire;
    }
    
    // Vérifier si l'information est disponible via prixHistorique
    if (line.prixHistorique && line.prixHistorique.prix) {
      return line.prixHistorique.prix;
    }
    
    // Si on a un prix pour la ligne et une quantité, on peut calculer le prix unitaire
    if (line.prixLigne && line.quantite) {
      return line.prixLigne / line.quantite;
    }
    
    // Valeur par défaut
    return 0;
  };
  
  // Charger les commandes et les produits au montage du composant
  onMounted(async () => {
  console.log("Montage du composant orders.vue");
  try {
    await fetchOrders();
    console.log("Commandes récupérées:", orders.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
  }
  await fetchProducts();
});
  </script>