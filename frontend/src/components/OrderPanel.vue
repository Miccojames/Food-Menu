<template>
  <div class="sidebar">
    <div class="order-panel">
      <h3>YOUR ORDER</h3>
      <p class="order-count">{{ cartStore.cartCount }} {{ cartStore.cartCount === 1 ? 'item' : 'items' }} ready</p>

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
          <button class="remove-btn" aria-label="Remove" @click="cartStore.removeFromCart(item.food)">×</button>
        </div>

        <div class="order-total">
          <span>Total</span>
          <span>₱{{ cartStore.cartTotal }}</span>
        </div>

        <button class="checkout-btn" @click="$emit('checkout')">Proceed to Checkout</button>
      </div>

      <!-- EMPTY CART -->
      <div v-else class="empty-cart">
        <p>Your order is empty</p>
      </div>

      <div class="favorites">
        <div class="fav-header">
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
  top: 24px;
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
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
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
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(255, 94, 98, 0.3);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(255, 94, 98, 0.4);
}

.empty-cart {
  text-align: center;
  padding: 30px 0;
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
