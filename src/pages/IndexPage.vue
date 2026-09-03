<template>
  <!-- HEADER -->
  <header class="app-header">
    <div class="header-content">
      <div class="brand">
        <h1 class="app-title">{{ restaurantName }}</h1>
        <p class="app-subtitle">{{ subtitle }}</p>
      </div>
      <div class="cart-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <span>{{ cartCount }} items</span>
      </div>
    </div>
  </header>

  <!-- MAIN CONTENT -->
  <main class="page-content">
    <div class="container">
      <!-- HERO SECTION -->
      <section class="hero">
        <div class="hero-content">
          <h2>Delicious food,<br>delivered to you.</h2>
          <p>Explore our crafted menu and find your next craving.</p>
          <button class="hero-btn" @click="scrollToMenu">Explore Menu</button>
        </div>
      </section>

      <div class="main-grid">
        <!-- MENU SECTION -->
        <div class="menu-section">
          <!-- SEARCH -->
          <div class="search-wrapper">
            <div class="search-inner">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#aaa">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                v-model="search"
                type="text"
                placeholder="What are you craving today?"
                class="search-input"
              />
              <button class="search-btn" @click="selectedCategory = 'All'">Search</button>
            </div>
          </div>

          <!-- CATEGORIES -->
          <div class="q-mb-xl" id="menu-categories">
            <h3 class="section-heading">Menu Categories</h3>
            <div class="categories">
              <button
                v-for="cat in categories"
                :key="cat"
                class="category-btn"
                :class="{ active: selectedCategory === cat }"
                @click="selectCategory(cat)"
              >{{ cat }}</button>
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
                <img :src="food.image" :alt="food.name" class="food-img" />
                <button
                  class="fav-btn"
                  :class="{ favorited: food.favorite }"
                  @click="toggleFavorite(food)"
                >
                  <svg v-if="food.favorite" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ff5e62"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ccc"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
                </button>
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

                <button class="add-btn" @click="addToCart(food)">Add to Order</button>
              </div>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else class="empty-state">
            <div class="empty-icon">🍽️</div>
            <h3>No matching food found</h3>
            <p>Try searching for something else or clear filters.</p>
            <button class="clear-btn" @click="clearFilters">Clear Filters</button>
          </div>
        </div>

        <!-- ORDER PANEL -->
        <div class="sidebar">
          <div class="order-panel">
            <h3>YOUR ORDER</h3>
            <p class="order-count">{{ cartCount }} items ready</p>

            <div v-if="cart.length > 0" class="order-items">
              <div v-for="item in cart" :key="item.id" class="order-item">
                <div class="order-item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">₱{{ item.price }}</div>
                </div>
                <button class="remove-btn" @click="removeFromCart(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>

              <div class="order-total">
                <span>Total</span>
                <span>₱{{ cartTotal }}</span>
              </div>

              <button class="checkout-btn">Proceed to Checkout</button>
            </div>

            <!-- EMPTY CART -->
            <div v-else class="empty-cart">
              <div class="empty-icon">🛒</div>
              <p>Your order is empty</p>
            </div>

            <div class="favorites">
              <div class="fav-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f87171">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <h4>My Favorites</h4>
              </div>
              <p>You have {{ favoriteCount }} favorite items.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
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

<style scoped>
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
  background-clip: text;
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
  background-color: #1a1a1a;
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
  padding: 14px 28px;
  font-size: 16px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  margin-top: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255, 94, 98, 0.45);
}

/* MAIN GRID */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
  align-items: start;
}

.menu-section {
  min-width: 0;
}

/* SEARCH */
.search-wrapper {
  background: white;
  padding: 8px;
  border-radius: 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  margin-bottom: 40px;
}

.search-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: transparent;
  padding: 10px 4px;
}

.search-input::placeholder {
  color: #aaa;
}

.search-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  transform: translateY(-1px);
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
  margin-bottom: 40px;
}

.category-btn {
  border-radius: 30px;
  padding: 12px 28px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 14px;
  letter-spacing: 0.2px;
  border: 1px solid #eee;
  background: white;
  color: #555;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.06);
  border-color: #ff9966;
  color: #ff5e62;
}

.category-btn.active {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border-color: transparent;
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
  aspect-ratio: 1.3;
}

.food-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.food-card:hover .food-img {
  transform: scale(1.08);
}

.fav-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.fav-btn:hover {
  transform: scale(1.15);
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
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
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

.clear-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.35);
  transform: translateY(-2px);
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
  background: none;
  border: none;
  cursor: pointer;
  color: #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.remove-btn:hover {
  color: #ff5e62;
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
  background: #1a1a1a;
  color: white;
  border: none;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-top: 16px;
  font-family: 'Inter', sans-serif;
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
  .main-grid {
    grid-template-columns: 1fr;
  }
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
