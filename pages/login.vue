<template>
      <div class="text-center mb-6">
      <v-icon color="primary" size="48" class="mb-2 font-weight-bold">mdi-glass-wine</v-icon>
      <h1 class="text-h4 font-weight-bold text-primary">NEGOSUD</h1>
    </div>
  <div class="h-full pt-[16vh]">
    <div class="flex justify-center text-6xl">
      <UIcon name="i-mdi-glass-wine" />
      <h1 color="primary"><v-icon class="text-center mb-2" size="48">mdi-glass-wine</v-icon> Négosud</h1>
    </div>
    <div class="flex justify-center items-center h-[100vh] pb-[39vh]">
      <LoginForm />
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  title: "Connexion",
  description: "Page de connexion",
  layout: false,
});
</script>