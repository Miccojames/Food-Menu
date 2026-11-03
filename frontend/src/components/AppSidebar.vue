<template>
  <!-- Desktop: fixed left rail -->
  <aside class="app-sidebar" :class="{ open: mobileOpen }">
    <div class="side-top">
      <router-link to="/menu" class="brand" @click="$emit('close')">
        <div class="brand-name">BiteBoard</div>
        <div class="brand-tagline">GOOD FOOD. SIMPLE CHOICES.</div>
      </router-link>

      <!-- User chip -->
      <div v-if="user" class="user-chip">
        <span class="avatar">{{ user.username.charAt(0).toUpperCase() }}</span>
        <div class="user-meta">
          <div class="user-hi">Hi,</div>
          <div class="user-name">{{ user.username }}</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="side-nav">
        <router-link v-if="isCustomer" to="/my-orders" class="side-link" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>My Orders</span>
        </router-link>

        <button class="side-link danger" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </nav>
    </div>

    <!-- Cart pinned to the bottom of the rail -->
    <button class="cart-btn" @click="$emit('cart-click'); $emit('close')">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      <span>Cart</span>
      <span class="cart-count" v-if="cartStore.cartCount > 0">{{ cartStore.cartCount }}</span>
    </button>
  </aside>

  <!-- Mobile: top bar with hamburger -->
  <div class="mobile-bar">
    <button class="hamburger" aria-label="Open menu" @click="$emit('toggle-mobile')">
      <span></span><span></span><span></span>
    </button>
    <router-link to="/menu" class="mobile-brand">BiteBoard</router-link>
    <button class="mobile-cart" aria-label="Cart" @click="$emit('cart-click')">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      <span v-if="cartStore.cartCount > 0" class="mobile-cart-count">{{ cartStore.cartCount }}</span>
    </button>
  </div>

  <!-- Mobile scrim -->
  <div v-if="mobileOpen" class="scrim" @click="$emit('close')"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart.store';
import { authService } from '../services/auth.service.js';

defineProps({
  mobileOpen: Boolean
});
defineEmits(['cart-click', 'toggle-mobile', 'close']);

const cartStore = useCartStore();
const router = useRouter();

const user = computed(() => authService.getUser());
const isCustomer = computed(() => user.value?.role === 'customer');

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* { font-family: 'Inter', sans-serif; }

/* ===== Desktop rail ===== */
.app-sidebar {
  width: 250px;
  min-height: 100vh;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
  padding: 24px 18px;
  box-sizing: border-box;
  z-index: 200;
}

.brand {
  display: block;
  text-decoration: none;
  margin-bottom: 22px;
}

.brand-name {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.8px;
  background: linear-gradient(135deg, #ff5e62 0%, #ff9966 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.brand-tagline {
  font-size: 9px;
  color: #aaa;
  font-weight: 700;
  letter-spacing: 1.1px;
  margin-top: 3px;
}

/* User chip */
.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f5f6fa;
  border: 1px solid #eaebee;
  border-radius: 14px;
  margin-bottom: 18px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-hi {
  font-size: 11px;
  color: #999;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

/* Nav links */
.side-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.side-link:hover {
  background: #fff5f5;
  color: #ff5e62;
}

.side-link.danger:hover {
  background: #fff5f5;
  color: #e53e3e;
}

/* Cart button pinned bottom */
.cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 94, 98, 0.3);
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
  position: relative;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(255, 94, 98, 0.4);
}

.cart-count {
  background: white;
  color: #ff5e62;
  font-size: 11px;
  font-weight: 800;
  min-width: 20px;
  height: 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

/* ===== Mobile bar (hidden on desktop) ===== */
.mobile-bar {
  display: none;
  position: sticky;
  top: 0;
  z-index: 250;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 10px 16px;
  align-items: center;
  justify-content: space-between;
}

.hamburger {
  background: none;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.hamburger span {
  display: block;
  width: 16px;
  height: 2px;
  background: #444;
  border-radius: 2px;
}

.mobile-brand {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ff5e62 0%, #ff9966 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.mobile-cart {
  position: relative;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 94, 98, 0.3);
}

.mobile-cart-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #1a1a1a;
  color: white;
  font-size: 10px;
  font-weight: 800;
  min-width: 17px;
  height: 17px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.scrim {
  display: none;
}

/* ===== Breakpoint: rail -> drawer ===== */
@media (max-width: 960px) {
  .mobile-bar {
    display: flex;
  }

  .app-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
  }

  .app-sidebar.open {
    transform: translateX(0);
  }

  .scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 150;
  }
}
</style>
