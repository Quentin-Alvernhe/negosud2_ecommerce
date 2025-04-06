<template>
  <!-- Carrousel promotionnel -->
  <v-container fluid class="mb-4">
    <v-carousel cycle height="500px" show-arrows="hover">
      <v-carousel-item
        v-for="(slide, index) in promoSlides"
        :key="index"
        :src="slide.image"
        cover
      >
        <v-container class="fill-height d-flex flex-column justify-end align-center">
          <v-sheet color="rgba(0, 0, 0, 0.5)" class="pa-4 rounded">
            <h3 class="text-white text-center">{{ slide.message }}</h3>
          </v-sheet>
        </v-container>
      </v-carousel-item>
    </v-carousel>
  </v-container>

  <v-container fluid>
    <v-row>
      <!-- Menu latéral -->
      <v-col cols="12" md="3">
        <v-sheet class="pa-4" elevation="2">
          <h3>Filtres</h3>

          <!-- Barre de recherche -->
          <v-text-field
            v-model="searchQuery"
            label="Rechercher un produit"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
          />

          <!-- Filtrage par catégorie -->
          <v-divider class="my-3"></v-divider>
          <h4>Catégories</h4>
          <v-text-field
            v-model="categorySearch"
            label="Rechercher une catégorie"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            clearable
          />
          <v-chip-group multiple>
            <v-chip
              v-for="cat in filteredCategories"
              :key="cat.id"
              :color="selectedCategories.includes(cat.id) ? 'primary' : 'default'"
              @click="toggleCategory(cat.id)"
            >
              {{ cat.nom }}
            </v-chip>
          </v-chip-group>

          <!-- Filtrage par prix -->
          <v-divider class="my-3"></v-divider>
          <h4>Prix</h4>
          <v-range-slider
            v-model="priceRange"
            :min="minPrice"
            :max="maxPrice"
            step="5"
            hide-details
            thumb-label="always"
          ></v-range-slider>
          <p>Prix : {{ Math.round(priceRange[0]) }}€ - {{ Math.round(priceRange[1]) }}€</p>

          <!-- Tri des produits -->
          <v-divider class="my-3"></v-divider>
          <h4>Tri</h4>
          <v-select
            v-model="sortOrder"
            :items="[ 
              { text: 'Prix croissant', value: 'asc' },
              { text: 'Prix décroissant', value: 'desc' }
            ]"
            item-title="text"
            item-value="value"
            label="Trier par prix"
            variant="outlined"
          />
        </v-sheet>
      </v-col>

      <!-- Galerie de produits -->
      <v-col cols="12" md="9">
        <v-row>
          <v-col
            v-for="product in paginatedProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-img :src="product.photo" height="200px" cover></v-img>
              <v-card-title>{{ product.nom }}</v-card-title>
              <v-card-subtitle>{{ product.category.nom }}</v-card-subtitle>
              <v-card-text>
                <strong>{{ product.prix }} €</strong>
              </v-card-text>
              <v-card-actions>
                <v-text-field
                  v-model="quantities[product.id]"
                  type="number"
                  min="1"
                  max="99"
                  label="Qté"
                  variant="outlined"
                  density="compact"
                  style="max-width: 80px;"
                ></v-text-field>

                <v-btn icon color="primary" @click="addToCart(product)">
                  <v-icon>mdi-cart-plus</v-icon>
                </v-btn>

                <v-btn color="primary" @click="showProductDetails(product)">Voir Détails</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          rounded="circle"
          color="primary"
          class="mt-4"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
    <!-- Drawer des détails du produit (À DROITE) -->
    <v-navigation-drawer
    v-model="drawer"
    temporary
    right
    width="400"
    location="right"
  >
    <v-container v-if="selectedProduct">
      <v-btn icon @click="drawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-img :src="selectedProduct.photo" height="250px" cover class="mb-3"></v-img>
      <h2>{{ selectedProduct.nom }}</h2>
      <p><strong>Catégorie :</strong> {{ selectedProduct.category.nom }}</p>
      <p><strong>Description :</strong> {{ selectedProduct.description }}</p>
      <p><strong>Prix :</strong> {{ selectedProduct.prix }} €</p>
      <p><strong>Quantité disponible :</strong> {{ selectedProduct.quantite }}</p>

      <!-- Sélection de la quantité et ajout au panier sur la même ligne -->
      <v-divider class="my-3"></v-divider>
      <v-row align="center" justify="space-between">
        <v-col cols="6">
          <v-text-field
            v-model="quantities[selectedProduct.id]"
            type="number"
            min="1"
            max="99"
            label="Qté"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-btn color="primary" block @click="addToCart(selectedProduct)">
            <v-icon left>mdi-cart-plus</v-icon> Ajouter
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>

  <!-- Notification -->
  <Notification
    v-model="snackbar.visible"
    :message="snackbar.message"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProducts } from "~/composables/useProducts";
import { useCartStore } from "~/stores/cart";
import { useNotification } from "~/composables/useNotification";

const { products, fetchProducts } = useProducts();
const cartStore = useCartStore();
const { snackbar, showNotification } = useNotification();

const promoSlides = ref([
  {
    image: "/images/caroussel/bordeaux_reduction.jpg",
    message: "Offre spéciale : -20% sur les vins de Bordeaux !",
  },
  {
    image: "https://via.placeholder.com/1200x300/ff5733/ffffff?text=Promo+2",
    message: "Livraison gratuite dès 50€ d'achat !",
  },
  {
    image: "https://via.placeholder.com/1200x300/33ff57/ffffff?text=Promo+3",
    message: "Nouveaux arrivages : Découvrez nos vins exclusifs !",
  }
]);
const searchQuery = ref("");
const categorySearch = ref("");
const selectedCategories = ref([]);
const priceRange = ref([0, 3000]);
const sortOrder = ref("asc");

const drawer = ref(false);
const selectedProduct = ref(null);
const quantities = ref({}); 
const currentPage = ref(1);
const itemsPerPage = 6; 

const categories = computed(() =>
  [...new Set(products.value.map((p) => p.category.id))].map((id) => {
    const category = products.value.find((p) => p.category.id === id)?.category;
    return category ? { id: category.id, nom: category.nom } : null;
  }).filter(Boolean)
);

const filteredCategories = computed(() => {
  return categories.value.filter((cat) =>
    cat.nom.toLowerCase().includes(categorySearch.value.toLowerCase())
  );
});

// Fonction pour activer/désactiver une catégorie
const toggleCategory = (categoryId) => {
  if (selectedCategories.value.includes(categoryId)) {
    selectedCategories.value = selectedCategories.value.filter((id) => id !== categoryId);
  } else {
    selectedCategories.value.push(categoryId);
  }
};

const showProductDetails = (product) => {
  selectedProduct.value = product;
  if (!quantities.value[product.id]) {
    quantities.value[product.id] = 1;
  }
  drawer.value = true;
};

const addToCart = (product) => {
  const quantity = parseInt(quantities.value[product.id]) || 1;
  
  if (quantity < 1) {
    showNotification("La quantité doit être supérieure à 0", "error");
    return;
  }
  
  if (quantity > product.quantite) {
    showNotification(`Désolé, seulement ${product.quantite} exemplaires disponibles.`, "error");
    return;
  }
  
  cartStore.addItem(product, quantity);
  showNotification(`${product.nom} ajouté au panier`, "success");
  quantities.value[product.id] = 1;
};

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return sortedProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage);
});

const sortedProducts = computed(() => {
  return [...filteredProducts.value].sort((a, b) =>
    sortOrder.value === "asc" ? a.prix - b.prix : b.prix - a.prix
  );
});

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    return (
      product.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category.id)) &&
      product.prix >= priceRange.value[0] &&
      product.prix <= priceRange.value[1] &&
      product.actif // S'assurer que le produit est actif
    );
  });
});

// Déterminer les bornes min et max du prix
const minPrice = computed(() =>
  products.value.length ? Math.min(...products.value.map((p) => p.prix)) : 0
);
const maxPrice = computed(() =>
  products.value.length ? Math.max(...products.value.map((p) => p.prix)) : 700
);

onMounted(() => {
  fetchProducts();
  // Initialiser les quantités à 1 pour tous les produits
  products.value.forEach(product => {
    quantities.value[product.id] = 1;
  });
});
</script>