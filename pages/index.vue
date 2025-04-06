<template>
<v-container>
  <v-row>
    <v-col cols="12" md="3">
      <v-navigation-drawer v-model="drawer" :permanent="!mobile" app>
        <v-text-field v-model="searchQuery" label="Rechercher un produit" dense clearable></v-text-field>
        <v-slider v-model="priceRange" label="Prix" min="0" max="100" thumb-label></v-slider>
        <v-checkbox v-for="category in categories" :key="category" v-model="selectedCategories" :label="category"></v-checkbox>
      </v-navigation-drawer>
    </v-col>
    <v-col cols="12" md="9">
      <v-row>
        <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4">
          <v-card>
            <v-img :src="product.image" height="150"></v-img>
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-subtitle>{{ product.category }} - {{ product.price }}€</v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary">Ajouter au panier</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</v-container>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify';
const { mobile } = useDisplay();
    const searchQuery = ref('');
    const selectedCategories = ref([]);
    const priceRange = ref([0, 100]);
    const drawer = ref(true);

    const products = ref([
      { id: 1, name: 'Château Margaux', category: 'Rouge', price: 50, image: 'wine1.jpg' },
      { id: 2, name: 'Domaine Leflaive', category: 'Blanc', price: 70, image: 'wine2.jpg' },
      { id: 3, name: 'Pétrus', category: 'Rouge', price: 90, image: 'wine3.jpg' },
    ]);

    const categories = ref(['Rouge', 'Blanc', 'Rosé']);

    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        const nameMatch = product.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(
          searchQuery.value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
        );
        const categoryMatch = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category);
        const priceMatch = product.price >= priceRange.value[0] && product.price <= priceRange.value[1];
        return nameMatch && categoryMatch && priceMatch;
      });
    });

</script>
