<template>
    <v-dialog
      :model-value="visible"
      @update:model-value="handleVisibleChange"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          {{ isEditMode ? 'Modifier l\'article' : 'Ajouter un article' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Référence de l'article -->
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.reference"
                  label="Rérérence"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Nom -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.nom"
                  label="Nom"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>

              <!-- Référence fournisseur -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.referenceFournisseur"
                  label="Référence fournisseur"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>

               <!-- Sélection de la catégorie -->
               <v-col cols="12">
                <v-select
                  v-model="editedItem.category"
                  :items="activeCategories"
                  item-title="nom"
                  item-value="id"
                  label="Catégories"
                  :rules="[rules.required]"
                  required
                  return-object
                />
              </v-col>

             <!-- Sélection du fournisseur -->
             <v-col cols="12">
                <v-select
                  v-model="editedItem.supplier"
                  :items="activeSuppliers"
                  item-title="nom"
                  item-value="id"
                  label="Fournisseur"
                  :rules="[rules.required]"
                  required
                  return-object
                />
              </v-col>
  
              <!-- Quantité -->
              <v-col cols="12" md="6">
                <v-number-input
                  v-model="editedItem.quantite"
                  :reverse="false"
                  controlVariant="default"
                  label="Quantité"
                  :hideInput="false"
                  :inset="false"
                  :rules="[rules.required]"
                  required
                ></v-number-input>
              </v-col>
  
              <!-- Quantité minimum -->
              <v-col cols="12" md="6">
                <v-number-input
                  v-model="editedItem.quantiteMinimum"
                  :reverse="false"
                  controlVariant="default"
                  label="Quantité minimum"
                  :hideInput="false"
                  :inset="false"
                  :rules="[rules.required]"
                  required
                ></v-number-input>
              </v-col>

               <!-- Prix de l'article -->
               <v-col cols="12" md="6">
                <v-number-input
                  v-model="editedItem.prix"
                  :reverse="false"
                  controlVariant="default"
                  label="Prix"
                  :hideInput="false"
                  :inset="false"
                  :rules="[rules.required]"
                  required
                ></v-number-input>
              </v-col>

               <!-- taux de tva de l'article -->
               <v-col cols="12" md="6">
                <v-number-input
                  v-model="editedItem.tauxTva"
                  :reverse="false"
                  controlVariant="default"
                  label="Taux de TVA"
                  :hideInput="false"
                  :inset="false"
                  :rules="[rules.required]"
                  required
                ></v-number-input>
              </v-col>


              <!-- Description de l'article -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.description"
                  label="Description"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Image de l'article -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.photo"
                  label="Image"
                  required
                ></v-text-field>
              </v-col>
  
              <!-- Statut -->
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="editedItem.actif"
                  label="Actif"
                  color="green"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Annuler</v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="handleSubmit"
            :disabled="!formValid"
          >
            {{ isEditMode ? 'Modifier' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

   <script setup lang="ts">
   import { ref, watch, defineProps, defineEmits } from 'vue';
   import type { Product } from '~/types/Product';
   import type { Supplier } from '~/types/Supplier';
   import type { Category } from '~/types/Category';
   import { useCategories } from '~/composables/useCategories';
   import { useSuppliers } from '~/composables/useSuppliers';
   
   const props = defineProps<{
     visible: boolean;
     isEditMode?: boolean;
     initialProduct?: Product;
   }>();
   
   const emit = defineEmits(['update:visible', 'submit']);
 
   const { categories, fetchCategories } = useCategories();

   const { suppliers, fetchSuppliers } = useSuppliers();
   
   const editedItem = ref<Product>({
    id: '',
    reference: '',
    nom: '',
    referenceFournisseur: '',
    quantite: 0,
    category: { id: '', nom: '', active: true },
    quantiteMinimum: 0,
    quantitePrevisionnelle: 0,
    prix: 0,
    tauxTva: 0,
    supplier: { id: '', nom: '', email: '', website: '', codepostal: 0, codecommune: 0, adresse: '', numerobatiment: 0, ville: '', statut: true, phone: '' },
    description: '',
    photo: '',
    actif: true,
   });
   
   const formValid = ref(false);
   
   const rules = {
     required: (value: any) => !!value || 'Ce champ est obligatoire.'
   };
   const activeSuppliers = ref<Supplier[]>([]);
    const activeCategories = ref<Category[]>([]);

   
   const fetchActiveSuppliers = async () => {
      await fetchSuppliers();
      activeSuppliers.value = suppliers.value.filter(supplier => supplier.statut);
    };

    const fetchActiveCategories = async () => {
      await fetchCategories();
      activeCategories.value = categories.value.filter(category => category.active);
    };
   
   // Réagir aux changements de la prop initialProduct
   watch(
     () => props.initialProduct,
     (newValue) => {
       if (newValue) {
         editedItem.value = { ...newValue };
       } else {
         editedItem.value = {
          id: '',
          reference: '',
          nom: '',
          referenceFournisseur: '',
          quantite: 0,
          category: { id: '', nom: '', active: true },
          quantiteMinimum: 0,
          quantitePrevisionnelle: 0,
          prix: 0,
          tauxTva: 0,
          supplier: { id: '', nom: '', email: '', website: '', codepostal: 0, codecommune: 0, adresse: '', numerobatiment: 0, ville: '', statut: true, phone: '' },
          description: '',
          photo: '',
          actif: true,
         };
       }
     },
     { immediate: true }
   );
 
   onMounted(() => {
   fetchCategories();
   fetchSuppliers(); 
   fetchActiveSuppliers();
   fetchActiveCategories();
 });
   
   // Fermer le modal
   const closeDialog = () => {
     emit('update:visible', false);
   };
   
   // Gérer la visibilité
   const handleVisibleChange = (value: boolean) => {
     emit('update:visible', value);
   };
   
   // Soumettre les données
   const handleSubmit = () => {
     emit('submit', { ...editedItem.value });
     closeDialog();
   };
   </script>
 