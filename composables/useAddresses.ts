import { ref } from 'vue';
import type { Ref } from 'vue';
import type { Address } from '~/types/Address';
import { AddressStatus } from '~/types/Address';
import { useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';

export function useAddresses() {
  const addresses: Ref<Address[]> = ref([]);
  const isLoading: Ref<boolean> = ref(true);
  const statutCode: Ref<number> = ref(0);
  const statutMessage: Ref<string> = ref('');

  const mapAddressFromApi = (apiAddress: any): Address => {
    return {
      id: apiAddress.id,
      codeCommune: apiAddress.codeCommune,
      codePostal: apiAddress.codePostal,
      nomRue: apiAddress.nomRue,
      nomVille: apiAddress.nomVille,
      numeroAppartement: apiAddress.numeroAppartement || '',
      numeroBatiment: apiAddress.numeroBatiment,
      statut: apiAddress.statut,
      horodatageAjout: apiAddress.horodatageAjout
    };
  };

  const mapAddressForApi = (address: Partial<Address>): any => {
    const mappedData: any = {};

    if (address.codeCommune !== undefined) mappedData.codeCommune = address.codeCommune;
    if (address.codePostal !== undefined) mappedData.codePostal = address.codePostal;
    if (address.nomRue !== undefined) mappedData.nomRue = address.nomRue;
    if (address.nomVille !== undefined) mappedData.nomVille = address.nomVille;
    if (address.numeroAppartement !== undefined) mappedData.numeroAppartement = address.numeroAppartement;
    if (address.numeroBatiment !== undefined) mappedData.numeroBatiment = address.numeroBatiment;
    if (address.statut !== undefined) mappedData.statut = address.statut;

    return mappedData;
  };

  const fetchAddresses = async (): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      // URL corrigée selon AdresseController.java
      const response = await $axios.get<Address[]>('utilisateur/client/adresse/all');
      addresses.value = response.data.map(mapAddressFromApi);

      statutCode.value = response.status;
      statutMessage.value = 'Les adresses ont été chargées avec succès.';
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors du chargement des adresses.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchShippingAddresses = async (): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<Address[]>('utilisateur/client/adresse/livraison');
      addresses.value = response.data.map(mapAddressFromApi);
      
      statutCode.value = response.status;
      statutMessage.value = 'Les adresses de livraison ont été chargées avec succès.';
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors du chargement des adresses de livraison.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBillingAddresses = async (): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<Address[]>('utilisateur/client/adresse/facturation');
      addresses.value = response.data.map(mapAddressFromApi);
      
      statutCode.value = response.status;
      statutMessage.value = 'Les adresses de facturation ont été chargées avec succès.';
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors du chargement des adresses de facturation.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const addAddress = async (address: Partial<Address>): Promise<Address | null> => {
    try {
      const { $axios } = useNuxtApp();
      const mappedData = mapAddressForApi(address);
      
      // URL corrigée selon AdresseController.java
      const response = await $axios.post(`utilisateur/client/adresse/new`, mappedData);
      
      statutCode.value = response.status;
      if (response.status === 201 || response.status === 200) {
        statutMessage.value = 'L\'adresse a été ajoutée avec succès.';
        const newAddress = mapAddressFromApi(response.data);
        addresses.value.push(newAddress);
        return newAddress;
      } else {
        statutMessage.value = 'Erreur lors de l\'ajout de l\'adresse.';
        return null;
      }
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors de l\'ajout de l\'adresse.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
      return null;
    }
  };

  const updateAddress = async (id: string, data: Partial<Address>): Promise<boolean> => {
    try {
      const { $axios } = useNuxtApp();
      const mappedData = mapAddressForApi(data);
      
      // URL corrigée selon AdresseController.java
      const response = await $axios.put(`utilisateur/client/adresse/${id}/edit`, mappedData);
      
      statutCode.value = response.status;
      if (response.status === 200) {
        statutMessage.value = 'L\'adresse a été mise à jour avec succès.';
        
        const index = addresses.value.findIndex(addr => addr.id === id);
        if (index !== -1) {
          addresses.value[index] = { ...addresses.value[index], ...mapAddressFromApi(response.data) };
        }
        
        return true;
      } else {
        statutMessage.value = 'Erreur lors de la mise à jour de l\'adresse.';
        return false;
      }
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors de la mise à jour de l\'adresse.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
      return false;
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      const { $axios } = useNuxtApp();
      
      // URL corrigée selon AdresseController.java
      const response = await $axios.delete(`utilisateur/client/adresse/${id}/delete`);
      
      statutCode.value = response.status;
      if (response.status === 200) {
        statutMessage.value = 'L\'adresse a été supprimée avec succès.';
        
        const index = addresses.value.findIndex(addr => addr.id === id);
        if (index !== -1) {
          addresses.value.splice(index, 1);
        }
        
        return true;
      } else {
        statutMessage.value = 'Erreur lors de la suppression de l\'adresse.';
        return false;
      }
    } catch (err: any) {
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors de la suppression de l\'adresse.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
      return false;
    }
  };

  // Filtrer les adresses par type
  const getAddressesByType = (type: AddressStatus) => {
    return addresses.value.filter(address => address.statut === type);
  };

  return {
    addresses,
    isLoading,
    statutCode,
    statutMessage,
    fetchAddresses,
    fetchShippingAddresses,
    fetchBillingAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getAddressesByType
  };
}