<template>
  <v-snackbar v-model="visible" :color="color" :timeout="timeout" class="notification">
    {{ message }}
    <v-btn text @click="close">Fermer</v-btn>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, toRefs, watch, nextTick } from 'vue';

// Props pour rendre le composant flexible
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'success', // Par défaut, success
  },
  timeout: {
    type: Number,
    default: 3000, // Par défaut, 3 secondes
  },
});

// Émettre des événements pour le parent
const emit = defineEmits(['update:modelValue']);

// Contrôle de la visibilité
const { modelValue } = toRefs(props); // Rendre modelValue réactif
const visible = ref(modelValue.value); // Initialisation de `visible`

// Synchronisation avec le parent
watch(modelValue, (newVal) => {
  visible.value = newVal;
  console.log("Notification visible state:", visible.value);
});

// Fermer la notification
const close = () => {
  visible.value = false;
  emit('update:modelValue', false);
};

// Quand la notification se ferme automatiquement après `timeout`, réinitialiser la visibilité
watch(visible, (newVal) => {
  if (!newVal) {
    // Quand la notification se ferme (par timeout ou action), réinitialiser la visibilité
    nextTick(() => {
      emit('update:modelValue', false);
    });
  }
});
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}
</style>
