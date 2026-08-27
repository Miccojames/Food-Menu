<template>
  <!-- HEADER -->
  <header class="app-header">
    <div class="header-content">
      <div class="brand">
        <h1 class="app-title">{{ restaurantName }}</h1>
        <p class="app-subtitle">{{ subtitle }}</p>
      </div>
      <div class="cart-badge">
        <q-icon name="shopping_cart" size="20px" />
        <span>{{ cartCount }} items</span>
      </div>
    </div>
  </header>

  <!-- MAIN CONTENT -->
  <q-page class="page-content">
    <div class="container">
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="hero-content">
          <h2>Delicious food,<br>delivered to you.</h2>
          <p>Explore our crafted menu and find your next craving.</p>
          <q-btn unelevated rounded color="deep-orange" class="q-mt-lg hero-btn" label="Explore Menu" @click="scrollToMenu" />
        </div>
      </section>

      <div class="row q-col-gutter-xl">
        <!-- MENU SECTION -->
        <div class="col-12 col-lg-8 col-xl-9">
          <!-- SEARCH -->
          <div class="search-wrapper q-mb-xl">
            <q-input
              v-model="search"
              outlined
              rounded
              placeholder="What are you craving today?"
              class="search-input"
              bg-color="white"
              color="deep-orange"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" class="q-ml-sm" />
              </template>
              <template v-slot:append>
                <q-btn
                  unelevated
                  rounded
                  color="deep-orange"
                  label="Search"
                  class="q-px-lg q-mr-xs search-btn"
                  @click="selectedCategory = 'All'"
                />
              </template>
            </q-input>
          </div>

          <!-- CATEGORIES -->
          <div class="q-mb-xl" id="menu-categories">
            <h3 class="section-heading">Menu Categories</h3>
            <div class="categories">
              <q-btn
                v-for="cat in categories"
                :key="cat"
                :label="cat"
                :outline="selectedCategory !== cat"
                :unelevated="selectedCategory === cat"
                class="category-btn"
                :class="{ active: selectedCategory === cat }"
                @click="selectCategory(cat)"
              />
            </div>
          </div>

          <!-- FOODS GRID -->
          <div v-if="filteredFoods.length > 0" class="foods-grid">
            <div
              v-for="(food, index) in filteredFoods"
              :key="food.id"
              class="food-card"
              :style="{ animationDelay: (index * 0.1) + 's' }"
            >
              <div class="card-image-wrapper">
                <q-img :src="food.image" class="food-img" ratio="1.3" />
                <q-btn
                  round
                  :icon="food.favorite ? 'favorite' : 'favorite_border'"
                  class="fav-btn"
                  :class="{ favorited: food.favorite }"
                  @click="toggleFavorite(food)"
                />
              </div>

              <div class="card-body">
                <span class="badge">{{ food.category }}</span>
                <h4>{{ food.name }}</h4>
                <p>{{ food.description }}</p>

                <div class="footer">
                  <span class="price">₱{{ food.price }}</span>
                  <div v-if="food.spicy" class="status spicy">🌶 Spicy</div>
                  <div v-else-if="food.vegetarian" class="status veg">🌱 Veg</div>
                  <div v-else class="status pop">🔥 Popular</div>
                </div>

                <q-btn
                  unelevated
                  label="Add to Order"
                  class="add-btn"
                  @click="addToCart(food)"
                />
              </div>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else class="empty-state">
            <div class="empty-icon">🍽️</div>
            <h3>No matching food found</h3>
            <p>Try searching for something else or clear filters.</p>
            <q-btn
              rounded
              unelevated
              label="Clear Filters"
              color="deep-orange"
              @click="clearFilters"
            />
          </div>
        </div>

        <!-- ORDER PANEL -->
        <div class="col-12 col-lg-4 col-xl-3">
          <div class="order-panel">
            <h3>YOUR ORDER</h3>
            <p class="order-count">{{ cartCount }} items ready</p>

            <div v-if="cart.length > 0" class="order-items">
              <div v-for="item in cart" :key="item.id" class="order-item">
                <div class="order-item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">₱{{ item.price }}</div>
                </div>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  color="grey-5"
                  class="remove-btn"
                  @click="removeFromCart(item)"
                />
              </div>

              <div class="order-total">
                <span>Total</span>
                <span>₱{{ cartTotal }}</span>
              </div>
              
              <q-btn
                unelevated
                class="checkout-btn q-mt-md"
                label="Proceed to Checkout"
              />
            </div>

            <!-- EMPTY CART -->
            <div v-else class="empty-cart">
              <div class="empty-icon">🛒</div>
              <p>Your order is empty</p>
            </div>

            <div class="favorites q-mt-xl">
              <div class="fav-header">
                <q-icon name="favorite" color="red-4" size="24px" />
                <h4>My Favorites</h4>
              </div>
              <p>You have {{ favoriteCount }} favorite items.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

const restaurantName = ref('BiteBoard');
const subtitle = ref('Good food. Simple choices.');
const search = ref('');
const selectedCategory = ref('All');

const categories = ref(['All', 'Main', 'Snacks', 'Drinks', 'Dessert']);

const foods = ref([
  {
    id: 1,
    name: 'Chicken Rice Bowl',
    category: 'Main',
    price: 149,
    description: 'Grilled chicken with steamed rice and veggies',
    image: '/chicken-rice-bowl.jpg',
    favorite: false,
    spicy: false,
    vegetarian: false
  },
  {
    id: 2,
    name: 'Spicy Ramen',
    category: 'Main',
    price: 189,
    description: 'Hot noodles in spicy broth with soft egg',
    image: '/spicy-ramen.jpg',
    favorite: false,
    spicy: true,
    vegetarian: false
  },
  {
    id: 3,
    name: 'Burger Stack',
    category: 'Main',
    price: 199,
    description: 'Juicy beef patty with cheese and sauce',
    image: '/burger-stack.png',
    favorite: false,
    spicy: false,
    vegetarian: false
  },
  {
    id: 4,
    name: 'Garlic Chicken Pasta',
    category: 'Main',
    price: 175,
    description: 'Creamy pasta with tender chicken and garlic',
    image: '/chicken-pasta.jpg',
    favorite: false,
    spicy: false,
    vegetarian: false
  },
  {
    id: 5,
    name: 'Crispy Fries',
    category: 'Snacks',
    price: 89,
    description: 'Golden crispy fries with sea salt',
    image: '/crispy-fries.jpg',
    favorite: false,
    spicy: false,
    vegetarian: true
  },
  {
    id: 6,
    name: 'Chicken Wings',
    category: 'Snacks',
    price: 129,
    description: 'Crispy wings with sweet and savory glaze',
    image: '/chicken-wings.png',
    favorite: false,
    spicy: false,
    vegetarian: false
  },
  {
    id: 7,
    name: 'Iced Matcha',
    category: 'Drinks',
    price: 99,
    description: 'Refreshing matcha tea with creamy milk',
    image: '/iced-matcha.png',
    favorite: false,
    spicy: false,
    vegetarian: true
  },
  {
    id: 8,
    name: 'Strawberry Soda',
    category: 'Drinks',
    price: 79,
    description: 'Sweet fizzy soda with fresh fruit',
    image: '/strawberry-soda.png',
    favorite: false,
    spicy: false,
    vegetarian: true
  },
  {
    id: 9,
    name: 'Mango Cheesecake',
    category: 'Dessert',
    price: 159,
    description: 'Creamy cheesecake with fresh mango',
    image: '/mango-cheesecake.jpg',
    favorite: false,
    spicy: false,
    vegetarian: true
  },
  {
    id: 10,
    name: 'Chocolate Brownie',
    category: 'Dessert',
    price: 119,
    description: 'Rich fudgy brownie with gooey center',
    image: '/chocolate-brownie.jpg',
    favorite: false,
    spicy: false,
    vegetarian: true
  }
]);

const cart = ref([]);

const filteredFoods = computed(() => {
  return foods.value.filter(food => {
    const matchesSearch =
      food.name.toLowerCase().includes(search.value.toLowerCase()) ||
      food.description.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === 'All' || food.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

const favoriteCount = computed(() => {
  return foods.value.filter(food => food.favorite).length;
});

const cartCount = computed(() => {
  return cart.value.length;
});

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const toggleFavorite = (food) => {
  food.favorite = !food.favorite;
};

const addToCart = (food) => {
  cart.value.push({
    id: Math.random(),
    name: food.name,
    price: food.price
  });
};

const removeFromCart = (item) => {
  const index = cart.value.indexOf(item);
  if (index > -1) {
    cart.value.splice(index, 1);
  }
};

const clearFilters = () => {
  search.value = '';
  selectedCategory.value = 'All';
};

const scrollToMenu = () => {
  const el = document.getElementById('menu-categories');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped lang="css">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* BASE */
.page-content {
  background-color: #fcfcfc;
  font-family: 'Inter', sans-serif;
  padding-bottom: 80px;
}

/* HEADER */
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #1a1a1a;
  padding: 16px 0;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0,0,0,0.02);
  margin-bottom: 30px;
}

.header-content {
  max-width: 1300px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.brand {
  display: flex;
  flex-direction: column;
}

.app-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.app-subtitle {
  margin: 0;
  font-size: 11px;
  color: #888;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cart-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.cart-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 94, 98, 0.4);
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 24px;
}

/* HERO */
.hero {
  padding: 80px 40px;
  text-align: left;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background-image: url('/hero-bg.png');
  background-size: cover;
  background-position: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
  animation: fadeIn 0.8s ease-out;
}

.hero h2 {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero p {
  font-size: 18px;
  color: #f1f2f6;
  margin: 0 0 12px 0;
}

.hero-btn {
  font-weight: 700;
  padding: 10px 24px;
  font-size: 16px;
}

/* SEARCH */
.search-wrapper {
  background: white;
  padding: 8px;
  border-radius: 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}

.search-input {
  /* Hide the border of q-input to rely on wrapper */
}
:deep(.q-field__control) {
  border: none !important;
}
:deep(.q-field--outlined .q-field__control:before) {
  border: none !important;
}
:deep(.q-field--outlined .q-field__control:after) {
  border: none !important;
}

.search-btn {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
}

/* SECTION HEADING */
.section-heading {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
}

/* CATEGORIES */
.categories {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  animation: fadeIn 0.8s ease-out 0.3s backwards;
}

.category-btn {
  border-radius: 30px;
  padding: 12px 28px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 14px;
  letter-spacing: 0.2px;
  border: 1px solid #eee !important;
  background: white;
  color: #555;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.06);
  border-color: #ff9966 !important;
  color: #ff5e62;
}

.category-btn.active {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.3);
}

/* FOODS GRID */
.foods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

/* FOOD CARD */
.food-card {
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  background: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.6s ease-out backwards;
  border: 1px solid rgba(0,0,0,0.02);
}

.food-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(255, 94, 98, 0.12);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.food-img {
  transition: transform 0.7s ease;
}

.food-card:hover .food-img {
  transform: scale(1.08);
}

.fav-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  color: #ccc;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.fav-btn:hover {
  transform: scale(1.15);
}

.fav-btn.favorited {
  color: #ff5e62;
}

.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.badge {
  display: inline-block;
  background: #fff3f0;
  color: #ff5e62;
  font-weight: 800;
  font-size: 10px;
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-body h4 {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.card-body p {
  font-size: 14px;
  color: #777;
  margin: 0 0 24px 0;
  line-height: 1.6;
  flex: 1;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.price {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
}

.status {
  font-size: 11px;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}
.status.spicy { background: #fff0f0; color: #ff5e62; }
.status.veg { background: #f0fdf4; color: #16a34a; }
.status.pop { background: #fff7ed; color: #ea580c; }

.add-btn {
  width: 100%;
  border-radius: 14px;
  font-weight: 700;
  padding: 12px;
  background: linear-gradient(135deg, #ff5e62, #ff9966) !important;
  color: white !important;
  transition: all 0.3s ease;
  font-size: 15px;
}

.add-btn:hover {
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  transform: translateY(-2px);
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: fadeIn 0.5s ease-out;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  color: #777;
  margin: 0 0 24px 0;
}

/* ORDER PANEL */
.order-panel {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 100px;
  animation: slideInRight 0.6s ease-out backwards;
  border: 1px solid rgba(0,0,0,0.02);
}

.order-panel h3 {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  letter-spacing: 0.5px;
}

.order-count {
  font-size: 14px;
  color: #ff5e62;
  margin: 0 0 24px 0;
  font-weight: 600;
}

.order-items {
  max-height: 450px;
  overflow-y: auto;
  padding-right: 8px;
}

.order-items::-webkit-scrollbar {
  width: 4px;
}
.order-items::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 10px;
}
.order-items::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f2f6;
  animation: fadeIn 0.4s ease-out;
}

.order-item-info {
  flex: 1;
}

.item-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.item-price {
  font-size: 14px;
  color: #ff5e62;
  font-weight: 700;
}

.remove-btn {
  transition: all 0.2s ease;
}
.remove-btn:hover {
  color: #ff5e62 !important;
  background: #fff0f0;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 20px;
  padding-top: 20px;
}

.order-total span:last-child {
  color: #ff5e62;
  font-size: 26px;
  font-weight: 800;
}

.checkout-btn {
  width: 100%;
  border-radius: 14px;
  padding: 14px;
  background: #1a1a1a !important;
  color: white !important;
  font-weight: 700;
  font-size: 16px;
  transition: transform 0.2s ease;
}
.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.empty-cart .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-cart p {
  font-size: 16px;
  color: #aaa;
  font-weight: 500;
  margin: 0;
}

.favorites {
  background: #fff5f5;
  padding: 20px;
  border-radius: 20px;
  margin-top: 32px;
}

.fav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.fav-header h4 {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.favorites p {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .order-panel {
    position: relative;
    top: 0;
    margin-top: 32px;
  }
}

@media (max-width: 600px) {
  .app-header {
    padding: 16px 0;
  }
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  .hero {
    padding: 50px 20px;
  }
  .hero h2 {
    font-size: 36px;
  }
  .foods-grid {
    grid-template-columns: 1fr;
  }
}
</style>
