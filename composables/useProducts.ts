import { ref } from 'vue';
import type { Ref } from 'vue'; // Import du type Ref
import type { Product } from '~/types/Product';
import { useNuxtApp } from '#app';
import { utilities } from './utilities';

export function useProducts() {
  const products: Ref<Product[]> = ref([]); // Typage explicite pour les produits
  const isLoading: Ref<boolean> = ref(true);
  const statutCode: Ref<number> = ref(0); // Typage explicite pour le code statut
  const statutMessage: Ref<string> = ref('');
  const product: Ref<Product | null> = ref(null); // Typage explicite pour récupérer un seul produit
  const {JSONResponseToString} = utilities();

  //expérimentation mise en place d'un mappage de données entre l'api et le front pour éviter de changer les infos dans toute l'application en cas de modification de l'api
  const mapProductFromApi = (apiProduct: any): Product => {
    return {
      id: apiProduct.id,
      reference: apiProduct.reference,
      nom: apiProduct.nom,
      referenceFournisseur: apiProduct.referenceFournisseur,
      quantite: apiProduct.quantite,
      quantiteMinimum: apiProduct.quantiteMinimum,
      description: apiProduct.description,
      quantitePrevisionnelle: apiProduct.quantitePrevisionnelle,
      photo: apiProduct.photo,
      actif: apiProduct.actif,
      category: apiProduct.categorie,
      prix: apiProduct.prix,
      tauxTva: apiProduct.tauxTva,
      supplier: apiProduct.fournisseur

    };
  };
  const mapProductForApi = (product: Partial<Product>): any => {
    const mappedData: any = {};
  
    // Mapper uniquement les champs définis
    if (product.reference !== undefined) mappedData.reference = product.reference;
    if (product.nom !== undefined) mappedData.nom = product.nom;
    if (product.referenceFournisseur !== undefined) mappedData.referenceFournisseur = product.referenceFournisseur;
    if (product.quantite !== undefined) mappedData.quantite = product.quantite;
    if (product.quantiteMinimum !== undefined) mappedData.quantiteMinimum = product.quantiteMinimum;
    if (product.description !== undefined) mappedData.description = product.description;
    if (product.quantitePrevisionnelle !== undefined) mappedData.quantitePrevisionnelle = product.quantitePrevisionnelle;
    if (product.photo !== undefined) mappedData.photo = product.photo;
    if (product.actif !== undefined) mappedData.actif = product.actif;
    if (product.category !== undefined) mappedData.categorie = {'id': product.category.id};
    if (product.prix !== undefined) mappedData.prix = product.prix;
    if (product.tauxTva !== undefined) mappedData.tauxTva = product.tauxTva;
    if (product.supplier !== undefined) mappedData.fournisseur = {'id': product.supplier.id};
  
    return mappedData;
  };
  
  const fetchProducts = async (): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      const response = await $axios.get<Product[]>('article/all');
      products.value = response.data.map(mapProductFromApi);

      // Succès : enregistrer le statut et le message
      statutCode.value = response.status;
      statutMessage.value = 'Les articles ont été chargées avec succès.';
    } catch (err: any) {
      // Gestion des erreurs : extraire statut et message
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.data.message || 'Une erreur est survenue lors du chargement des articles.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }

      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };


  const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
    
    try {
      const { $axios } = useNuxtApp();
      const mappedData = mapProductForApi(data);
      const response = await $axios.put(`article/${id}/edit`, mappedData);
      
      // Succès : enregistrer le statut et le message
      statutCode.value = response.status;
      statutMessage.value = 'L\'article a été mise à jour avec succès.';


    } catch (err: any) {
      // Gestion des erreurs : extraire statut et message
      if (err.response) {
        statutCode.value = err.response.status;
         statutMessage.value = JSONResponseToString(err.response.data) || 'Une erreur est survenue lors de la mise à jour du produit.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }
      console.error(err);
    }
  };

  const addProduct = async (data: Partial<Product>): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      const mappedData = mapProductForApi(data);
      const response = await $axios.post(`article/new`, mappedData);
      //supplier.value = response.data;
      //Pour le moment pas de retour de l'api en cas de création donc simulation de l'objet
      //supplier.value = {id:"rffdd",email: data.email||"",nom:data.nom||"",};
      // Succès : enregistrer le statut et le message
      statutCode.value = response.status;
      statutMessage.value = 'L\'article a été ajouté avec succés.';

      products.value.unshift(mapProductFromApi(response.data));
    } catch (err: any) {
      // Gestion des erreurs : extraire statut et message
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = JSONResponseToString(err.response.data) || 'Une erreur est survenue lors de la création du produit.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }

      console.error(err);
    }
  };
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const { $axios } = useNuxtApp();
      
      const response = await $axios.patch(`article/${id}/disable`);
      statutCode.value = response.status;
      statutMessage.value = 'L\'article a été désactivé.';
    } catch (err: any) {
      // Gestion des erreurs : extraire statut et message
      if (err.response) {
        statutCode.value = err.response.status;
        statutMessage.value = err.response.status +' : '+ err.response.data.message + '-'+'Une erreur est survenue lors de la modification de l\'article.';
      } else {
        statutCode.value = 500;
        statutMessage.value = 'Erreur réseau ou serveur.';
      }

      console.error(err);
    }
  
};
  

  return {
    products,
    product,
    isLoading,
    statutCode,
    statutMessage,
    fetchProducts,
    updateProduct,
    addProduct,
    deleteProduct
  };
}