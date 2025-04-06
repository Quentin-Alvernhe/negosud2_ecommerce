<template>
    <div>
      <v-badge
        :content="cartItemCount"
        :value="cartItemCount"
        color="error"
        floating
      >
        <v-btn icon @click="openCartModal">
          <v-icon>mdi-cart-outline</v-icon>
        </v-btn>
      </v-badge>
  
      <!-- Modal du panier -->
      <v-dialog v-model="cartModal" max-width="800px">
        <v-card>
          <v-card-title class="text-h5">
            Votre panier
            <v-spacer></v-spacer>
            <v-btn icon @click="cartModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
  
          <v-card-text>
            <div v-if="!cartItems.length" class="text-center pa-4">
              <v-icon size="48" color="grey lighten-1">mdi-cart-outline</v-icon>
              <p class="mt-3 text-body-1">Votre panier est vide</p>
              <v-btn color="primary" class="mt-4" @click="cartModal = false">
                Continuer mes achats
              </v-btn>
            </div>
  
            <div v-else>
              <v-list>
                <v-list-item
                  v-for="item in cartItems"
                  :key="item.product.id"
                  class="mb-2"
                >
                <template v-slot:prepend>
                    <v-img :src="item.product.photo" />
                </template>
  
                <v-list-item-title>{{ item.product.nom }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.product.prix.toFixed(2) }} €</v-list-item-subtitle>
  
  
                  <v-list-item-action>
                    <div class="d-flex align-center">
                      <v-btn icon @click="decrementQuantity(item)">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <span class="mx-2">{{ item.quantity }}</span>
                      <v-btn icon @click="incrementQuantity(item)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item-action>
  
                  <v-list-item-action>
                    <v-btn icon color="red" @click="removeFromCart(item.product.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
  
              <v-divider class="my-4"></v-divider>
  
              <div class="d-flex justify-space-between align-center pa-4">
                <div class="text-h6">Total: {{ totalPrice.toFixed(2) }} €</div>
                <v-btn color="primary" @click="proceedToCheckout">
                  Passer commande
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useCartStore } from '~/stores/cart';
  import type { CartItem } from '~/stores/cart';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const cartStore = useCartStore();
  const cartModal = ref(false);
  
  // Calculer le nombre d'articles dans le panier
  const cartItemCount = computed(() => cartStore.totalItems);
  
  // Récupérer les articles du panier
  const cartItems = computed(() => cartStore.items);
  
  // Calculer le prix total
  const totalPrice = computed(() => cartStore.totalPrice);
  
  // Ouvrir la modal du panier
  const openCartModal = () => {
    cartModal.value = true;
  };
  
  // Supprimer un article du panier
  const removeFromCart = (productId: string) => {
    cartStore.removeItem(productId);
  };
  
  // Augmenter la quantité d'un article
  const incrementQuantity = (item: CartItem) => {
    if (item.quantity < item.product.quantite) {
      cartStore.updateQuantity(item.product.id, item.quantity + 1);
    }
  };
  
  // Diminuer la quantité d'un article
  const decrementQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      cartStore.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
    }
  };
  
  // Passer à la page de commande
  const proceedToCheckout = () => {
    cartModal.value = false;
    router.push('/checkout');
  };
  </script>