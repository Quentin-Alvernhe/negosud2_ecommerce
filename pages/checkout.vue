<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">Finaliser votre commande</h1>
          
                        <v-tabs v-model="currentStep" fixed-tabs>
                <v-tab value="1">Panier</v-tab>
                <v-tab value="2">Adresses</v-tab>
                <v-tab value="3">Confirmation</v-tab>
                </v-tabs>


                <v-window v-model="currentStep">
                <v-window-item value="1">
                    <v-card class="my-4">
                    <v-card-title>Récapitulatif de votre panier</v-card-title>
                    <v-card-text>
                        <div v-if="cartItems.length === 0" class="text-center pa-4">
                        <p>Votre panier est vide</p>
                        <v-btn color="primary" to="/shop" class="mt-4">Retourner à la boutique</v-btn>
                        </div>
                        <div v-else>
                        <v-table>
                            <thead>
                            <tr>
                                <th class="text-left">Produit</th>
                                <th class="text-center">Prix unitaire</th>
                                <th class="text-center">Quantité</th>
                                <th class="text-right">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in cartItems" :key="item.product.id">
                                <td>
                                <div class="d-flex align-center">
                                    <v-img :src="item.product.photo" width="50" height="50" class="mr-3"></v-img>
                                    <div>
                                    <div class="font-weight-medium">{{ item.product.nom }}</div>
                                    <div class="text-caption">{{ item.product.category.nom }}</div>
                                    </div>
                                </div>
                                </td>
                                <td class="text-center">{{ item.product.prix.toFixed(2) }} €</td>
                                <td class="text-center">{{ item.quantity }}</td>
                                <td class="text-right">{{ (item.product.prix * item.quantity).toFixed(2) }} €</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colspan="3" class="text-right font-weight-bold">Total</td>
                                <td class="text-right font-weight-bold">{{ totalPrice.toFixed(2) }} €</td>
                            </tr>
                            </tfoot>
                        </v-table>
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn to="/shop" variant="text">Continuer les achats</v-btn>
                        <v-btn color="primary" @click="currentStep = '2'" :disabled="cartItems.length === 0">
                        Continuer
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-window-item>
                <v-window-item value="2">
                <v-card class="my-4">
                  <v-card-title>Adresses de livraison et facturation</v-card-title>
                  <v-card-text>
                    <v-row>
                      <!-- Adresse de livraison -->
                      <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                          <v-card-title class="pb-2">Adresse de livraison</v-card-title>
                          
                          <div v-if="isLoading" class="text-center">
                            <v-progress-circular indeterminate></v-progress-circular>
                          </div>
                          
                          <div v-else>
                            <div v-if="shippingAddresses.length > 0">
                              <v-radio-group v-model="selectedShippingAddress">
                                <v-radio
                                  v-for="address in shippingAddresses"
                                  :key="address.id"
                                  :value="address.id"
                                  :label="formatAddress(address)"
                                ></v-radio>
                              </v-radio-group>
                            </div>
                            
                            <div v-else class="text-center mb-4">
                              <p>Aucune adresse de livraison disponible</p>
                            </div>
                            
                            <v-btn block color="primary" @click="openAddressDialog('livraison')">
                              {{ shippingAddresses.length > 0 ? 'Ajouter une nouvelle adresse de livraison' : 'Ajouter une adresse de livraison' }}
                            </v-btn>
                          </div>
                        </v-card>
                      </v-col>
                      
                      <!-- Adresse de facturation -->
                      <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                          <v-card-title class="pb-2">Adresse de facturation</v-card-title>
                          
                          <div v-if="isLoading" class="text-center">
                            <v-progress-circular indeterminate></v-progress-circular>
                          </div>
                          
                          <div v-else>
                            <div v-if="billingAddresses.length > 0">
                              <v-radio-group v-model="selectedBillingAddress">
                                <v-radio
                                  v-for="address in billingAddresses"
                                  :key="address.id"
                                  :value="address.id"
                                  :label="formatAddress(address)"
                                ></v-radio>
                              </v-radio-group>
                            </div>
                            
                            <div v-else class="text-center mb-4">
                              <p>Aucune adresse de facturation disponible</p>
                            </div>
                            
                            <v-btn block color="primary" @click="openAddressDialog('facturation')">
                              {{ billingAddresses.length > 0 ? 'Ajouter une nouvelle adresse de facturation' : 'Ajouter une adresse de facturation' }}
                            </v-btn>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="currentStep = '1'">Retour</v-btn>
                    <v-btn 
                      color="primary" 
                      @click="goToConfirmation" 
                      :disabled="!canProceedToConfirmation"
                    >
                      Continuer
                    </v-btn>
                  </v-card-actions>
                </v-card>
            </v-window-item>

            <!-- Etape 3-->

            <v-window-item value="3">
                <v-card class="my-4">
                  <v-card-title>Confirmation de la commande</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <h3 class="text-h6 mb-4">Adresse de livraison</h3>
                        <v-card variant="outlined" class="pa-3 mb-4">
                          <p v-if="shippingAddressDetails">{{ formatAddress(shippingAddressDetails) }}</p>
                        </v-card>
                        
                        <h3 class="text-h6 mb-4">Adresse de facturation</h3>
                        <v-card variant="outlined" class="pa-3">
                          <p v-if="billingAddressDetails">{{ formatAddress(billingAddressDetails) }}</p>
                        </v-card>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <h3 class="text-h6 mb-4">Récapitulatif de la commande</h3>
                        <v-card variant="outlined" class="pa-3">
                            <v-list>
                            <v-list-item v-for="item in cartItems" :key="item.product.id">
                                <!-- Remplacer par les slots de Vuetify 3 -->
                                <template v-slot:title>
                                {{ item.product.nom }} ({{ item.quantity }})
                                </template>
                                <template v-slot:subtitle>
                                {{ (item.product.prix * item.quantity).toFixed(2) }} €
                                </template>
                            </v-list-item>
                            </v-list>
                            
                            <v-divider class="my-3"></v-divider>
                            
                            <div class="d-flex justify-space-between">
                            <div class="text-h6">Total</div>
                            <div class="text-h6">{{ totalPrice.toFixed(2) }} €</div>
                            </div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="currentStep = '2'">Retour</v-btn>
                    <v-btn 
                      color="success" 
                      @click="placeOrder"
                      :loading="isOrderProcessing"
                    >
                      Confirmer la commande
                    </v-btn>
                  </v-card-actions>
                </v-card>
            </v-window-item>
        </v-window>
        </v-col>
      </v-row>
      
      <!-- Formulaire d'adresse -->
      <FormAddress
        :visible="addressDialog"
        :isEditMode="false"
        :initialAddress="initialAddress"
        @update:visible="addressDialog = $event"
        @submit="handleAddressSubmit"
      />
  
      <!-- Notification -->
      <Notification
        v-model="snackbar.visible"
        :message="snackbar.message"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      />
  
      <!-- Modal de confirmation de commande -->
      <v-dialog v-model="orderConfirmationDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5 text-center">
            <v-icon color="success" size="36" class="mr-2">mdi-check-circle</v-icon>
            Commande confirmée
          </v-card-title>
          <v-card-text class="text-center pa-4">
            <p class="mb-4">Merci pour votre commande !</p>
            <p>Votre commande N° <strong>{{ orderNumber }}</strong> a été confirmée et est en cours de traitement.</p>
            <p class="mt-4">Un email de confirmation vous a été envoyé.</p>
          </v-card-text>
          <v-card-actions class="justify-center pa-4">
            <v-btn color="primary" @click="finishOrder">
              Continuer mes achats
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useCartStore } from '~/stores/cart';
  import { useAddresses } from '~/composables/useAddresses';
  import { useOrders } from '~/composables/useOrders';
  import { useNotification } from '~/composables/useNotification';
  import { AddressStatus } from '~/types/Address';
  import type { Address } from '~/types/Address';
  import FormAddress from '~/components/Form/Address.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const cartStore = useCartStore();
  const { addresses, isLoading, fetchAddresses, addAddress } = useAddresses();
  const { createOrder } = useOrders();
  const { snackbar, showNotification } = useNotification();
  
  // Étape active du stepper
  const currentStep = ref("1");
  
  // Adresses
  const addressDialog = ref(false);
  const initialAddress = ref<Address>();
  const selectedShippingAddress = ref<string>();
  const selectedBillingAddress = ref<string>();
  const addressType = ref<'livraison' | 'facturation'>('livraison');
  
  // Commande
  const isOrderProcessing = ref(false);
  const orderConfirmationDialog = ref(false);
  const orderNumber = ref('');
  
  // Items du panier
  const cartItems = computed(() => cartStore.items);
  const totalPrice = computed(() => cartStore.totalPrice);
  
  // Filtres pour les adresses
  const shippingAddresses = computed(() => {
    return addresses.value.filter(address => 
      address.statut === AddressStatus.PRINCIPALE || 
      address.statut === AddressStatus.SECONDAIRE
    );
  });
  
  const billingAddresses = computed(() => {
    return addresses.value.filter(address => 
      address.statut === AddressStatus.FACTURATION
    );
  });
  
  // Détails des adresses sélectionnées
  const shippingAddressDetails = computed(() => {
    return addresses.value.find(address => address.id === selectedShippingAddress.value);
  });
  
  const billingAddressDetails = computed(() => {
    return addresses.value.find(address => address.id === selectedBillingAddress.value);
  });
  
  // Vérifier si l'utilisateur peut passer à l'étape de confirmation
  const canProceedToConfirmation = computed(() => {
    return !!selectedShippingAddress.value && !!selectedBillingAddress.value;
  });
  
  // Formater l'adresse pour l'affichage
  const formatAddress = (address: Address) => {
    if (!address) return '';
    
    let formatted = `${address.numeroBatiment} ${address.nomRue}`;
    if (address.numeroAppartement && address.numeroAppartement.trim() !== '') {
      formatted += `, Apt ${address.numeroAppartement}`;
    }
    formatted += `, ${address.codePostal} ${address.nomVille}`;
    
    return formatted;
  };
  
  // Ouvrir la boîte de dialogue d'adresse
  const openAddressDialog = (type: 'livraison' | 'facturation') => {
    addressType.value = type;
    
    initialAddress.value = {
      codeCommune: '',
      codePostal: '',
      nomRue: '',
      nomVille: '',
      numeroAppartement: '',
      numeroBatiment: '',
      statut: type === 'livraison' ? AddressStatus.PRINCIPALE : AddressStatus.FACTURATION
    };
    
    addressDialog.value = true;
  };
  
  // Gérer la soumission du formulaire d'adresse
  const handleAddressSubmit = async (addressData: Address) => {
    try {
      const newAddress = await addAddress(addressData);
      
      if (newAddress && newAddress.id) {
        if (addressType.value === 'livraison') {
          selectedShippingAddress.value = newAddress.id;
        } else {
          selectedBillingAddress.value = newAddress.id;
        }
        
        showNotification('Adresse ajoutée avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
      showNotification('Erreur lors de l\'ajout de l\'adresse', 'error');
    }
  };
  
  // Passer à l'étape de confirmation
  const goToConfirmation = () => {
  if (canProceedToConfirmation.value) {
    console.log('Passage à l\'étape 3 - Statut avant:', currentStep.value);
    currentStep.value = "3";
    console.log('Passage à l\'étape 3 - Statut après:', currentStep.value);
    console.log('Données pour la confirmation:', {
      shippingAddressDetails: shippingAddressDetails.value,
      billingAddressDetails: billingAddressDetails.value,
      cartItems: cartItems.value,
      totalPrice: totalPrice.value
    });
  } else {
    showNotification('Veuillez sélectionner les adresses de livraison et de facturation', 'error');
  }
};
  

// Passer la commande
const placeOrder = async () => {
  if (!selectedShippingAddress.value || !selectedBillingAddress.value) {
    showNotification('Veuillez sélectionner une adresse de livraison et de facturation', 'error');
    return;
  }
  
  isOrderProcessing.value = true;
  
  try {
    // Préparer les lignes de commande
    const orderLines = cartItems.value.map(item => ({
      article: { id: item.product.id },
      quantite: item.quantity
    }));
    
    // Date de livraison prévisionnelle (7 jours plus tard)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    
    // Préparer les données de la commande
    const orderData = {
      adresseLivraison: { id: selectedShippingAddress.value },
      adresseFacturation: { id: selectedBillingAddress.value },
      horodatagePrevisionLivraison: deliveryDate.toISOString(),
      lignesCommandeClient: orderLines
      // Pas besoin d'ajouter client explicitement, le backend le fait via le token JWT
    };
    
    console.log('Données de commande envoyées:', orderData);
    
    // Créer la commande en utilisant l'URL complète
    const order = await createOrder(orderData);
    console.log('Réponse de createOrder:', order);
    
    if (order) {
      // Vider le panier
      cartStore.clearCart();
      
      // Afficher la confirmation
      orderNumber.value = order.numeroCommande;
      orderConfirmationDialog.value = true;
    } else {
      showNotification('Une erreur est survenue lors de la création de la commande', 'error');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    showNotification('Une erreur est survenue lors de la création de la commande', 'error');
  } finally {
    isOrderProcessing.value = false;
  }
};
  
  // Terminer le processus de commande
  const finishOrder = () => {
    orderConfirmationDialog.value = false;
    router.push('/shop');
  };
  
  // Charger les adresses au montage du composant
  onMounted(async () => {
    if (cartItems.value.length === 0) {
      router.push('/shop');
      return;
    }
    
    await fetchAddresses();
    
    // Sélectionner automatiquement la première adresse de livraison et de facturation si disponible
    if (shippingAddresses.value.length > 0) {
      selectedShippingAddress.value = shippingAddresses.value[0].id;
    }
    
    if (billingAddresses.value.length > 0) {
      selectedBillingAddress.value = billingAddresses.value[0].id;
    }
  });
  </script>