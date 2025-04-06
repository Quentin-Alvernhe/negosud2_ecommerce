<template>
    <v-dialog :model-value="visible" max-width="400px" persistent @update:model-value="$emit('update:visible', $event)">
      <v-card>
        <v-card-title class="text-h6">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-btn text @click="$emit('cancel')">Annuler</v-btn>
          <v-btn color="primary" @click="$emit('confirm')">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    visible: boolean;
    title: string;
    message: string;
  }>();
  
  const emit = defineEmits(['update:visible', 'confirm', 'cancel']);
  </script>
  