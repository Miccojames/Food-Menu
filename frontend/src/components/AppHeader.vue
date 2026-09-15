<template>
  <header class="app-header">
    <div class="header-content">
      <div class="brand">
        <h1 class="app-title">{{ restaurantName }}</h1>
        <p class="app-subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-actions">
        <!-- Optional Admin Link for future use -->
        <router-link to="/admin" class="admin-link">Admin</router-link>
        <div class="cart-badge" @click="$emit('cart-click')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <span>{{ cartStore.cartCount }} items</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../stores/cart.store';

const cartStore = useCartStore();

const restaurantName = ref('BiteBoard');
const subtitle = ref('Good food. Simple choices.');
</script>

<style scoped>
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-link {
  font-weight: 600;
  color: #555;
  text-decoration: none;
  font-size: 14px;
}
.admin-link:hover {
  color: #ff5e62;
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
</style>
