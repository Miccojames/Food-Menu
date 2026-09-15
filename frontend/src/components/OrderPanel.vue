<template>
  <div class="sidebar">
    <div class="order-panel">
      <h3>YOUR ORDER</h3>
      <p class="order-count">{{ cartStore.cartCount }} items ready</p>

      <div v-if="cartStore.cart.length > 0" class="order-items">
        <div v-for="item in cartStore.cart" :key="item.food" class="order-item">
          <div class="order-item-info">
            <div class="item-name">{{ item.name }} (x{{ item.quantity }})</div>
            <div class="item-price">₱{{ item.price * item.quantity }}</div>
          </div>
          <div class="qty-controls">
             <button class="qty-btn" @click="cartStore.decreaseQuantity(item.food)">-</button>
             <button class="qty-btn" @click="cartStore.increaseQuantity(item.food)">+</button>
          </div>
          <button class="remove-btn" @click="cartStore.removeFromCart(item.food)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>

        <div class="order-total">
          <span>Total</span>
          <span>₱{{ cartStore.cartTotal }}</span>
        </div>

        <button class="checkout-btn" @click="$emit('checkout')">Proceed to Checkout</button>
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
        <p>You have {{ favStore.favoriteCount }} favorite items.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.store';
import { useFavoriteStore } from '../stores/favorite.store';

const cartStore = useCartStore();
const favStore = useFavoriteStore();
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 100px;
}

.order-panel {
  background: white;
  border-radius: 28px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.02);
}

.order-panel h3 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.order-count {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px 0;
  font-weight: 500;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #eee;
}

.order-item-info {
  flex: 1;
}

.item-name {
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-size: 15px;
}

.item-price {
  color: #ff5e62;
  font-weight: 700;
  font-size: 14px;
}

.qty-controls {
  display: flex;
  gap: 4px;
}

.qty-btn {
  background: #f1f2f6;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.remove-btn {
  background: #fff0f0;
  color: #ff5e62;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #ff5e62;
  color: white;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0 24px 0;
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0,0,0,0.15);
  background: #000;
}

.empty-cart {
  text-align: center;
  padding: 30px 0;
}

.empty-cart .empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.empty-cart p {
  color: #888;
  font-weight: 500;
  margin: 0;
}

.favorites {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.fav-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.fav-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1a1a1a;
}

.favorites p {
  margin: 0;
  font-size: 14px;
  color: #777;
}
</style>
