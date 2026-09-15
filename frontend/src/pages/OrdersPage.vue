<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" to="/" />
        <q-toolbar-title>Order History</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="text-h5 q-mb-md">All Orders</div>

        <q-table
          :rows="orders"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
        >
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <router-link :to="`/orders/${props.row.id}`" class="text-primary text-weight-bold" style="text-decoration: none;">
                #{{ String(props.row.id).padStart(4, '0') }}
              </router-link>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="getStatusColor(props.row.status)" text-color="white" dense>
                {{ props.row.status }}
              </q-chip>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
               <q-btn flat round color="primary" icon="visibility" :to="`/orders/${props.row.id}`" />
            </q-td>
          </template>
        </q-table>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { orderService } from '../services/order.service';

const $q = useQuasar();
const orders = ref([]);
const loading = ref(true);

const columns = [
  { name: 'id', align: 'left', label: 'Order ID', field: 'id' },
  { name: 'customerName', align: 'left', label: 'Customer', field: 'customerName', sortable: true },
  { name: 'totalAmount', align: 'left', label: 'Total (₱)', field: 'totalAmount', sortable: true },
  { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
  { name: 'date', align: 'left', label: 'Date', field: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
  { name: 'actions', align: 'center', label: 'View', field: 'actions' }
];

const fetchOrders = async () => {
  try {
    const res = await orderService.getOrders();
    orders.value = res.data;
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Failed to load orders' });
  } finally {
    loading.value = false;
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
  fetchOrders();
});
</script>
