<template>
  <AppHeader @cart-click="scrollToOrder" />

  <main class="page-content">
    <div class="container">
      <HeroSection />

      <div class="main-grid">
        <!-- MENU SECTION -->
        <div class="menu-section">
          <FoodSearch v-model="search" @search="fetchFoods" />
          
          <CategoryFilter 
            v-model="selectedCategory" 
            :categories="categories" 
          />

          <!-- Loading State -->
          <LoadingState v-if="loading" />

          <!-- Error State -->
          <EmptyState 
            v-else-if="error" 
            title="Unable to load the menu" 
            :message="error" 
            :show-clear="false" 
          />

          <!-- FOODS GRID -->
          <div v-else-if="foods.length > 0" class="foods-grid">
            <FoodCard
              v-for="(food, index) in foods"
              :key="food.id"
              :food="food"
              :is-favorite="favStore.isFavorite(food.id)"
              :style="{ animationDelay: (index * 0.05) + 's' }"
              @add-to-cart="cartStore.addToCart"
              @toggle-favorite="favStore.toggleFavorite(food.id)"
            />
          </div>

          <!-- EMPTY STATE -->
          <EmptyState v-else @clear="clearFilters" />
        </div>

        <!-- ORDER PANEL SIDEBAR -->
        <OrderPanel id="order-panel" @checkout="showCheckout = true" />
      </div>
    </div>
  </main>

  <CheckoutDialog v-model="showCheckout" @order-placed="onOrderPlaced" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart.store';
import { useFavoriteStore } from '../stores/favorite.store';
import { foodService } from '../services/food.service';
import { categoryService } from '../services/category.service';

import AppHeader from '../components/AppHeader.vue';
import HeroSection from '../components/HeroSection.vue';
import FoodSearch from '../components/FoodSearch.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import FoodCard from '../components/FoodCard.vue';
import OrderPanel from '../components/OrderPanel.vue';
import CheckoutDialog from '../components/CheckoutDialog.vue';
import LoadingState from '../components/LoadingState.vue';
import EmptyState from '../components/EmptyState.vue';

const $q = useQuasar();
const router = useRouter();
const cartStore = useCartStore();
const favStore = useFavoriteStore();

const search = ref('');
const selectedCategory = ref('All');
const categories = ref([]);
const foods = ref([]);
const loading = ref(true);
const error = ref(null);
const showCheckout = ref(false);

const fetchCategories = async () => {
  try {
    const res = await categoryService.getCategories();
    categories.value = res.data;
  } catch (err) {
    console.error('Failed to load categories', err);
  }
};

const fetchFoods = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {};
    if (search.value) params.search = search.value;
    if (selectedCategory.value !== 'All') params.category = selectedCategory.value;
    
    const res = await foodService.getFoods(params);
    foods.value = res.data;
  } catch (err) {
    error.value = 'Please try again later. Ensure the backend is running.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  search.value = '';
  selectedCategory.value = 'All';
  fetchFoods();
};

const scrollToOrder = () => {
  const el = document.getElementById('order-panel');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const onOrderPlaced = (orderId) => {
  router.push('/orders/' + orderId);
};

// Watch for category changes
watch(selectedCategory, () => {
  fetchFoods();
});

onMounted(() => {
  fetchCategories();
  fetchFoods();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.page-content {
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
  padding: 24px 0 80px;
  min-height: calc(100vh - 64px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  align-items: start;
}

.menu-section {
  min-width: 0;
}

.foods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

@media (max-width: 960px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
