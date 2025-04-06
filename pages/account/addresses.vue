<template>
    <v-container>
      <h1 class="text-h4 mb-6">Mes adresses</h1>
      
      <div v-if="isLoading" class="d-flex justify-center my-8">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      
      <div v-else>
        <v-row v-if="addresses.length > 0">
          <v-col v-for="address in addresses" :key="address.id" cols="12" md="6" lg="4">
            <v-card class="mb-4">
              <v-card-title>
                <div class="d-flex align-center">
                  <v-icon
                    :color="getAddressTypeColor(address.statut)"
                    class="mr-2"
                  >
                    {{ getAddressTypeIcon(address.statut) }}
                  </v-icon>
                  {{ getAddressTypeLabel(address.statut) }}
                </div>
              </v-card-title>
              
              <v-card-text>
                <p class="mb-0">{{ address.numeroBatiment }} {{ address.nomRue }}</p>
                <p v-if="address.numeroAppartement" class="mb-0">Appartement {{ address.numeroAppartement }}</p>
                <p>{{ address.codePostal }} {{ address.nomVille }}</p>
              </v-card-text>
              
              <v-card-actions>
                <v-btn icon variant="text" @click="editAddress(address)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon variant="text" color="error" @click="deleteAddressConfirm(address)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <div v-else class="text-center my-8">
          <v-icon size="64" color="grey lighten-1">mdi-map-marker-off</v-icon>
          <p class="mt-4 text-body-1">Vous n'avez pas encore d'adresse enregistrée.</p>
        </div>
        
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="mt-4"
          @click="addNewAddress"
        >
          Ajouter une nouvelle adresse
        </v-btn>
      </div>
      
      <!-- Formulaire d'adresse -->
      <FormAddress
        :visible="addressDialog"
        :isEditMode="isEditingAddress"
        :initialAddress="editedAddress"
        @update:visible="addressDialog = $event"
        @submit="saveAddress"
      />
      
      <!-- Boîte de dialogue de confirmation de suppression -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5">Supprimer l'adresse</v-card-title>
          <v-card-text>Êtes-vous sûr de vouloir supprimer cette adresse ?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" variant="text" @click="deleteDialog = false">Annuler</v-btn>
            <v-btn color="error" variant="elevated" @click="confirmDeleteAddress">Supprimer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Notification -->
      <Notification
        v-model="snackbar.visible"
        :message="snackbar.message"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      />
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAddresses } from '~/composables/useAddresses';
  import { useNotification } from '~/composables/useNotification';
  import { AddressStatus } from '~/types/Address';
  import type { Address } from '~/types/Address';
  import FormAddress from '~/components/Form/Address.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress } = useAddresses();
  const { snackbar, showNotification } = useNotification();
  
  // État pour gérer les formulaires et boîtes de dialogue
  const addressDialog = ref(false);
  const isEditingAddress = ref(false);
  const editedAddress = ref<Address>();
  const deleteDialog = ref(false);
  const addressToDelete = ref<string | null>(null);
  
  // Fonction pour obtenir le libellé du type d'adresse
  const getAddressTypeLabel = (type: AddressStatus) => {
    if (type === undefined) return 'Adresse';
    
    switch (type) {
      case AddressStatus.PRINCIPALE:
        return 'Adresse principale';
      case AddressStatus.SECONDAIRE:
        return 'Adresse secondaire';
      case AddressStatus.FACTURATION:
        return 'Adresse de facturation';
      default:
        return 'Adresse';
    }
  };
  
  // Fonction pour obtenir l'icône du type d'adresse
  const getAddressTypeIcon = (type: AddressStatus) => {
    if (type === undefined) return 'mdi-map-marker';
    
    switch (type) {
      case AddressStatus.PRINCIPALE:
        return 'mdi-home';
      case AddressStatus.SECONDAIRE:
        return 'mdi-truck-delivery';
      case AddressStatus.FACTURATION:
        return 'mdi-file-document';
      default:
        return 'mdi-map-marker';
    }
  };
  
  // Fonction pour obtenir la couleur du type d'adresse
  const getAddressTypeColor = (type: AddressStatus) => {
    if (type === undefined) return 'grey';
    
    switch (type) {
      case AddressStatus.PRINCIPALE:
        return 'primary';
      case AddressStatus.SECONDAIRE:
        return 'purple';
      case AddressStatus.FACTURATION:
        return 'success';
      default:
        return 'grey';
    }
  };
  
  // Fonction pour ajouter une nouvelle adresse
  const addNewAddress = () => {
    isEditingAddress.value = false;
    editedAddress.value = {
      codeCommune: '',
      codePostal: '',
      nomRue: '',
      nomVille: '',
      numeroBatiment: '',
      numeroAppartement: '',
      statut: AddressStatus.PRINCIPALE
    };
    addressDialog.value = true;
  };
  
  // Fonction pour éditer une adresse existante
  const editAddress = (address: Address) => {
    isEditingAddress.value = true;
    editedAddress.value = { ...address };
    addressDialog.value = true;
  };
  
  // Fonction pour sauvegarder l'adresse (ajout ou modification)
  const saveAddress = async (addressData: Address) => {
    try {
      if (isEditingAddress.value && editedAddress.value?.id) {
        // Mise à jour d'une adresse existante
        const success = await updateAddress(editedAddress.value.id, addressData);
        if (success) {
          showNotification('Adresse mise à jour avec succès', 'success');
        } else {
          showNotification('Erreur lors de la mise à jour de l\'adresse', 'error');
        }
      } else {
        // Ajout d'une nouvelle adresse
        const newAddress = await addAddress(addressData);
        if (newAddress) {
          showNotification('Adresse ajoutée avec succès', 'success');
        } else {
          showNotification('Erreur lors de l\'ajout de l\'adresse', 'error');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'adresse:', error);
      showNotification('Une erreur est survenue', 'error');
    }
  };
  
  // Fonction pour demander confirmation avant suppression
  const deleteAddressConfirm = (address: Address) => {
    if (address.id) {
      addressToDelete.value = address.id;
      deleteDialog.value = true;
    }
  };
  
  // Fonction pour confirmer la suppression d'une adresse
  const confirmDeleteAddress = async () => {
    if (addressToDelete.value) {
      try {
        const success = await deleteAddress(addressToDelete.value);
        if (success) {
          showNotification('Adresse supprimée avec succès', 'success');
        } else {
          showNotification('Erreur lors de la suppression de l\'adresse', 'error');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'adresse:', error);
        showNotification('Une erreur est survenue', 'error');
      } finally {
        deleteDialog.value = false;
        addressToDelete.value = null;
      }
    }
  };
  
  // Charger les adresses au montage du composant
  onMounted(async () => {
    await fetchAddresses();
  });
  </script>