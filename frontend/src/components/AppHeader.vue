<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/menu" class="brand">
        <h1 class="app-title">{{ restaurantName }}</h1>
        <p class="app-subtitle">{{ subtitle }}</p>
      </router-link>

      <div class="header-actions">
        <!-- User Greeting -->
        <div v-if="user" class="user-greeting">
          <span class="avatar-chip">{{ user.username.charAt(0).toUpperCase() }}</span>
          <span class="user-name">Hi, {{ user.username }}</span>
        </div>

        <!-- My Orders Link (Customer only) -->
        <router-link v-if="isCustomer" to="/my-orders" class="header-btn nav-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>My Orders</span>
        </router-link>

        <!-- Logout Button -->
        <button v-if="user" class="header-btn logout-btn" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>

        <!-- Cart Badge -->
        <div class="cart-badge" @click="$emit('cart-click')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <span>{{ cartStore.cartCount }} items</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart.store';
import { authService } from '../services/auth.service.js';

const cartStore = useCartStore();
const router = useRouter();

const restaurantName = 'BiteBoard';
const subtitle = 'GOOD FOOD. SIMPLE CHOICES.';

const user = computed(() => authService.getUser());
const isCustomer = computed(() => user.value?.role === 'customer');

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
}

.header-content {
  max-width: 1280px;
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
  text-decoration: none;
}

.app-title {
  margin: 0;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.8px;
  background: linear-gradient(135deg, #ff5e62 0%, #ff9966 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.app-subtitle {
  margin: 2px 0 0 0;
  font-size: 10px;
  color: #999;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f5f6fa;
  border-radius: 30px;
  border: 1px solid #eaebee;
}

.avatar-chip {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 30px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #4a5568;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  height: 38px;
}

.nav-btn:hover {
  border-color: #ff5e62;
  color: #ff5e62;
  background: #fff5f5;
}

.logout-btn:hover {
  border-color: #e53e3e;
  color: #e53e3e;
  background: #fff5f5;
}

.cart-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 13px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  padding: 0 18px;
  height: 38px;
  border-radius: 30px;
  box-shadow: 0 4px 14px rgba(255, 94, 98, 0.3);
  transition: all 0.25s ease;
  cursor: pointer;
}

.cart-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(255, 94, 98, 0.4);
}

@media (max-width: 640px) {
  .user-greeting { display: none; }
  .app-title { font-size: 22px; }
  .header-actions { gap: 8px; }
  .header-btn { padding: 6px 12px; font-size: 12px; }
}
</style>
