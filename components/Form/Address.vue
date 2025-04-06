<template>
    <v-dialog
      :model-value="visible"
      @update:model-value="handleVisibleChange"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          {{ isEditMode ? 'Modifier l\'adresse' : 'Ajouter une adresse' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Nom de rue -->
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.nomRue"
                  label="Adresse"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              
              <!-- Numéro de bâtiment -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.numeroBatiment"
                  label="Numéro de bâtiment"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              
              <!-- Numéro d'appartement -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.numeroAppartement"
                  label="Numéro d'appartement"
                ></v-text-field>
              </v-col>
              
              <!-- Code postal -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.codePostal"
                  label="Code postal"
                  :rules="[rules.required, rules.codePostal]"
                  required
                ></v-text-field>
              </v-col>
              
              <!-- Code commune -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.codeCommune"
                  label="Code commune"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              
              <!-- Ville -->
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.nomVille"
                  label="Ville"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              
              <!-- Type d'adresse -->
              <v-col cols="12">
                <v-select
                  v-model="editedItem.statut"
                  :items="addressTypes"
                  item-title="text"
                  item-value="value"
                  label="Type d'adresse"
                  :rules="[rules.required]"
                  required
                ></v-select>
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
  import type { Address } from '~/types/Address';
  import { AddressStatus } from '~/types/Address';
  
  const props = defineProps<{
    visible: boolean;
    isEditMode?: boolean;
    initialAddress?: Address;
  }>();
  
  const emit = defineEmits(['update:visible', 'submit']);
  
  const formValid = ref(false);
  
  const addressTypes = [
    { text: 'Adresse principale', value: AddressStatus.PRINCIPALE },
    { text: 'Adresse secondaire', value: AddressStatus.SECONDAIRE },
    { text: 'Adresse de facturation', value: AddressStatus.FACTURATION }
  ];
  
  const editedItem = ref<Address>({
    codeCommune: '',
    codePostal: '',
    nomRue: '',
    nomVille: '',
    numeroBatiment: '',
    numeroAppartement: '',
    statut: AddressStatus.PRINCIPALE
  });
  
  const rules = {
    required: (value: any) => !!value || 'Ce champ est obligatoire.',
    codePostal: (value: string) => /^\d{5}$/.test(value) || 'Le code postal doit contenir 5 chiffres.'
  };
  
  // Réagir aux changements de la prop initialAddress
  watch(
    () => props.initialAddress,
    (newValue) => {
      if (newValue) {
        editedItem.value = { ...newValue };
      } else {
        editedItem.value = {
          codeCommune: '',
          codePostal: '',
          nomRue: '',
          nomVille: '',
          numeroBatiment: '',
          numeroAppartement: '',
          statut: AddressStatus.PRINCIPALE
        };
      }
    },
    { immediate: true }
  );
  
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