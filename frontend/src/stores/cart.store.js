import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref(JSON.parse(localStorage.getItem('biteboard_cart')) || []);

  const saveCart = () => {
    localStorage.setItem('biteboard_cart', JSON.stringify(cart.value));
  };

  const addToCart = (food) => {
    // Supports both `id` (Prisma/PostgreSQL) and `_id` (legacy MongoDB)
    const foodId = food.id ?? food._id;
    const existingItem = cart.value.find(item => item.food === foodId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.push({
        food: foodId,
        name: food.name,
        price: food.price,
        quantity: 1,
      });
    }
    saveCart();
  };

  const removeFromCart = (foodId) => {
    const index = cart.value.findIndex(item => item.food === foodId);
    if (index > -1) {
      cart.value.splice(index, 1);
      saveCart();
    }
  };

  const increaseQuantity = (foodId) => {
    const item = cart.value.find(item => item.food === foodId);
    if (item) {
      item.quantity += 1;
      saveCart();
    }
  };

  const decreaseQuantity = (foodId) => {
    const item = cart.value.find(item => item.food === foodId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      saveCart();
    } else if (item && item.quantity === 1) {
      removeFromCart(foodId);
    }
  };

  const clearCart = () => {
    cart.value = [];
    saveCart();
  };

  const cartCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };
});
