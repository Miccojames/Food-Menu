<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" to="/orders" />
        <q-toolbar-title>Order Details</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <LoadingState v-if="loading" message="Loading order details..." />
        
        <q-card v-else-if="order" style="width: 100%; max-width: 600px; border-radius: 16px;">
          <q-card-section>
            <div class="row justify-between items-center">
              <div class="text-h6">Order #{{ String(order.id).padStart(4, '0') }}</div>
              <q-chip :color="getStatusColor(order.status)" text-color="white">
                {{ order.status }}
              </q-chip>
            </div>
            <div class="text-caption text-grey-7">
              Placed on {{ new Date(order.createdAt).toLocaleString() }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Customer Details</div>
            <div>Name: {{ order.customerName }}</div>
            <div>Contact: {{ order.customerContact }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Items</div>
            <q-list separator>
              <q-item v-for="item in order.items" :key="item.id">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>x{{ item.quantity }} @ ₱{{ item.price }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold">₱{{ item.subtotal }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row justify-between text-h6 text-weight-bold">
              <span>Total</span>
              <span class="text-primary">₱{{ order.totalAmount }}</span>
            </div>
          </q-card-section>

          <!-- Admin Status Update (Visible to anyone for this demo) -->
          <q-card-section class="bg-grey-2">
            <div class="text-subtitle2 q-mb-sm">Update Status (Admin)</div>
            <div class="row q-gutter-sm">
              <q-btn outline color="orange" label="Pending" @click="updateStatus('Pending')" :disable="order.status === 'Pending'" />
              <q-btn outline color="blue" label="Preparing" @click="updateStatus('Preparing')" :disable="order.status === 'Preparing'" />
              <q-btn outline color="teal" label="Ready" @click="updateStatus('Ready')" :disable="order.status === 'Ready'" />
              <q-btn outline color="positive" label="Completed" @click="updateStatus('Completed')" :disable="order.status === 'Completed'" />
              <q-btn outline color="negative" label="Cancelled" @click="updateStatus('Cancelled')" :disable="order.status === 'Cancelled'" />
            </div>
          </q-card-section>
        </q-card>
        
        <EmptyState v-else title="Order Not Found" message="The requested order does not exist." />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { orderService } from '../services/order.service';
import LoadingState from '../components/LoadingState.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const $q = useQuasar();

const order = ref(null);
const loading = ref(true);

const fetchOrder = async () => {
  try {
    const res = await orderService.getOrder(route.params.id);
    order.value = res.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (status) => {
  try {
    await orderService.updateOrderStatus(order.value.id, status);
    order.value.status = status;
    $q.notify({ color: 'positive', message: `Status updated to ${status}` });
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Failed to update status' });
  }
};

const getStatusColor = (status) => {
  const colors = {
    'Pending': 'orange',
    'Preparing': 'blue',
    'Ready': 'teal',
    'Completed': 'positive',
    'Cancelled': 'negative'
  };
  return colors[status] || 'grey';
};

onMounted(() => {
  fetchOrder();
});
</script>
