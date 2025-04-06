import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Order, OrderResponse } from '~/types/Order';
import { useNuxtApp } from '#app';

export function useOrders() {
  const orders: Ref<OrderResponse[]> = ref([]);
  const currentOrder: Ref<OrderResponse | null> = ref(null);
  const isLoading: Ref<boolean> = ref(true);
  const statutCode: Ref<number> = ref(0);
  const statutMessage: Ref<string> = ref('');

  const fetchOrders = async (): Promise<void> => {
    console.log("Tentative de récupération des commandes...");
  try {
    const { $axios } = useNuxtApp();
    console.log("Avant appel API: utilisateur/client/commandes");
    const response = await $axios.get<OrderResponse[]>('utilisateur/client/commandes');
    console.log("Réponse API:", response);
    orders.value = response.data;
    
    statutCode.value = response.status;
    statutMessage.value = 'Les commandes ont été chargées avec succès.';
  } catch (err: any) {
    console.error("Erreur complète:", err);
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors du chargement des commandes.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const createOrder = async (orderData: Order): Promise<OrderResponse | null> => {
    try {
      const { $axios } = useNuxtApp();
      
      // Log pour déboguer
      console.log('useOrders - Envoi de la commande:', orderData);
      
      // Définir la date de livraison prévisionnelle à 7 jours plus tard si elle n'est pas déjà définie
      if (!orderData.horodatagePrevisionLivraison) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        orderData.horodatagePrevisionLivraison = deliveryDate.toISOString();
      }
      
      // Attention aux CORS - vérifier que l'URL est correcte
      const response = await $axios.post<OrderResponse>('commande/client/new', orderData);
      
      // Log pour déboguer
      console.log('useOrders - Réponse:', response.status, response.data);
      
      statutCode.value = response.status;
      if (response.status === 201 || response.status === 200) {
        statutMessage.value = 'La commande a été créée avec succès.';
        currentOrder.value = response.data;
        orders.value.unshift(response.data);
        return response.data;
      } else {
        statutMessage.value = 'Erreur lors de la création de la commande.';
        return null;
      }
    } catch (err: any) {
      // Afficher tous les détails de l'erreur
      console.error('useOrders - Erreur complète:', err);
      
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data ? 
          (err.response.data.message || JSON.stringify(err.response.data)) : 
          'Une erreur est survenue lors de la création de la commande.';
        console.error('useOrders - Statut de l\'erreur:', err.response.status);
        console.error('useOrders - Données d\'erreur:', err.response.data);
      } else if (err.request) {
        statutCode.value = 0;
        statutMessage.value = 'Aucune réponse reçue du serveur.';
        console.error('useOrders - Erreur de requête (pas de réponse):', err.request);
      } else {
        statutCode.value = 500;
        statutMessage.value = err.message || 'Erreur réseau ou serveur.';
        console.error('useOrders - Message d\'erreur:', err.message);
      }
      
      return null;
    }
  };

  const getOrderById = async (orderId: string): Promise<OrderResponse | null> => {
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<OrderResponse>(`commande/client/${orderId}`);
      
      statutCode.value = response.status;
      if (response.status === 200) {
        statutMessage.value = 'La commande a été récupérée avec succès.';
        currentOrder.value = response.data;
        return response.data;
      } else {
        statutMessage.value = 'Erreur lors de la récupération de la commande.';
        return null;
      }
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors de la récupération de la commande.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
      return null;
    }
  };

  return {
    orders,
    currentOrder,
    isLoading,
    statutCode,
    statutMessage,
    fetchOrders,
    createOrder,
    getOrderById
  };
}