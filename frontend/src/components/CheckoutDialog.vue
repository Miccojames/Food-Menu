<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 350px; border-radius: 16px;">
      <q-card-section>
        <div class="text-h6 font-weight-bold">Checkout</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="customerName"
            label="Your Name"
            outlined
            dense
            :rules="[val => !!val || 'Name is required']"
          />
          <q-input
            v-model="customerContact"
            label="Contact Number"
            outlined
            dense
            :rules="[val => !!val || 'Contact number is required']"
          />
          
          <div class="order-summary q-mt-md q-pa-md bg-grey-2" style="border-radius: 8px;">
            <div class="text-subtitle2 q-mb-sm">Order Summary</div>
            <div v-for="item in cartStore.cart" :key="item.food" class="row justify-between q-mb-xs">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>₱{{ item.price * item.quantity }}</span>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row justify-between text-weight-bold">
              <span>Total</span>
              <span class="text-primary">₱{{ cartStore.cartTotal }}</span>
            </div>
          </div>
          
          <div class="row justify-end q-mt-lg">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn type="submit" label="Place Order" color="primary" class="q-ml-sm" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useCartStore } from '../stores/cart.store';
import { orderService } from '../services/order.service';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue', 'order-placed']);
const $q = useQuasar();
const cartStore = useCartStore();

const customerName = ref('');
const customerContact = ref('');
const loading = ref(false);

const onSubmit = async () => {
  if (cartStore.cart.length === 0) {
    $q.notify({
      color: 'negative',
      message: 'Your cart is empty',
      icon: 'warning'
    });
    return;
  }

  loading.value = true;
  try {
    const orderData = {
      customerName: customerName.value,
      customerContact: customerContact.value,
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
