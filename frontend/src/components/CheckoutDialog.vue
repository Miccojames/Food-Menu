<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="checkout-card">
      <!-- Gradient header -->
      <div class="checkout-head">
        <div>
          <h3 class="checkout-title">Checkout</h3>
          <p class="checkout-sub">{{ cartStore.cart.length }} item(s) ready to order</p>
        </div>
        <button class="checkout-close" type="button" @click="$emit('update:modelValue', false)">
          ✕
        </button>
      </div>

      <div class="checkout-body">
        <form @submit.prevent="onSubmit">
          <!-- Contact details -->
          <div class="field">
            <label class="field-label" for="ck-name">Your Name</label>
            <input
              id="ck-name"
              v-model="customerName"
              type="text"
              class="field-input"
              :class="{ invalid: errors.name }"
              placeholder="e.g. Juan Dela Cruz"
              @input="errors.name = ''"
            />
            <p v-if="errors.name" class="field-err">{{ errors.name }}</p>
          </div>

          <div class="field">
            <label class="field-label" for="ck-contact">Contact Number</label>
            <input
              id="ck-contact"
              v-model="customerContact"
              type="tel"
              class="field-input"
              :class="{ invalid: errors.contact }"
              placeholder="e.g. 0917 123 4567"
              @input="errors.contact = ''"
            />
            <p v-if="errors.contact" class="field-err">{{ errors.contact }}</p>
          </div>

          <!-- Order summary -->
          <div class="summary">
            <div class="summary-head">Order Summary</div>

            <div v-for="item in cartStore.cart" :key="item.food" class="summary-row">
              <div class="summary-item">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-unit">₱{{ item.price }} each</span>
              </div>

              <div class="qty-stepper">
                <button type="button" class="qty-btn" @click="cartStore.decreaseQuantity(item.food)">−</button>
                <span class="qty-val">{{ item.quantity }}</span>
                <button type="button" class="qty-btn" @click="cartStore.increaseQuantity(item.food)">+</button>
              </div>

              <div class="line-total">₱{{ item.price * item.quantity }}</div>
            </div>

            <div class="summary-sep"></div>

            <div class="summary-total">
              <span>Total</span>
              <span class="total-value">₱{{ cartStore.cartTotal.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="checkout-actions">
            <button type="button" class="cancel-btn" @click="$emit('update:modelValue', false)">
              Cancel
            </button>
            <button type="submit" class="place-btn" :disabled="loading">
              <span v-if="loading" class="btn-spinner"></span>
              <span v-else>Place Order →</span>
            </button>
          </div>
        </form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart.store';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth.service.js';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'order-placed']);
const $q = useQuasar();
const cartStore = useCartStore();

const _user = authService.getUser();
const customerName = ref(_user?.username || '');
const customerContact = ref('');
const loading = ref(false);
const errors = reactive({ name: '', contact: '' });

const validate = () => {
  errors.name = '';
  errors.contact = '';
  if (!customerName.value.trim() || customerName.value.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!customerContact.value.trim() || customerContact.value.trim().length < 5) {
    errors.contact = 'Please enter a valid contact number.';
  }
  return !errors.name && !errors.contact;
};

const onSubmit = async () => {
  if (cartStore.cart.length === 0) {
    $q.notify({
      color: 'negative',
      message: 'Your cart is empty',
      icon: 'warning'
    });
    return;
  }
  if (!validate()) return;

  loading.value = true;
  try {
    const orderData = {
      customerName: customerName.value.trim(),
      customerContact: customerContact.value.trim(),
      items: cartStore.cart.map(item => ({
        food: item.food,
        quantity: item.quantity
      }))
    };

    const res = await orderService.createOrder(orderData);

    $q.notify({
      color: 'positive',
      message: 'Order placed successfully!',
      icon: 'check'
    });

    cartStore.clearCart();
    emit('order-placed', res.data.id);
    emit('update:modelValue', false);

  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Failed to place order',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* { font-family: 'Inter', sans-serif; }

.checkout-card {
  width: 460px;
  max-width: 94vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

/* Gradient header */
.checkout-head {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  padding: 22px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.checkout-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.checkout-sub {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.9;
}

.checkout-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.checkout-close:hover {
  background: rgba(255, 255, 255, 0.35);
}

.checkout-body {
  padding: 24px;
  background: #fafafa;
  overflow-y: auto;
  min-height: 0;
}

/* Fields (same language as the login page) */
.field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 7px;
}

.field-input {
  width: 100%;
  background: white;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.field-input::placeholder { color: #bbb; font-weight: 400; }

.field-input:focus {
  border-color: #ff5e62;
  box-shadow: 0 0 0 3px rgba(255, 94, 98, 0.1);
}

.field-input.invalid {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.08);
}

.field-err {
  margin: 6px 0 0;
  font-size: 12px;
  font-weight: 500;
  color: #e53e3e;
}

/* Summary */
.summary {
  background: white;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 16px 18px;
  margin-top: 20px;
}

.summary-head {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #999;
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.summary-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-unit {
  font-size: 12px;
  color: #999;
}

.qty-stepper {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f5f6fa;
  border-radius: 30px;
  padding: 3px;
}

.qty-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #ff5e62;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease;
}

.qty-btn:hover { transform: scale(1.1); }

.qty-val {
  min-width: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.line-total {
  min-width: 74px;
  text-align: right;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.summary-sep {
  height: 1px;
  background: #f0f0f0;
  margin: 10px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.total-value {
  font-size: 22px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

/* Actions */
.checkout-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn {
  flex: 1;
  background: white;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  border-color: #ccc;
  background: #f5f6fa;
}

.place-btn {
  flex: 2;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(255, 94, 98, 0.3);
  transition: all 0.25s ease;
}

.place-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(255, 94, 98, 0.4);
}

.place-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
