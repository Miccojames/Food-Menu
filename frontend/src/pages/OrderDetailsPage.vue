<template>
  <div class="order-details-page">

    <!-- Header -->
    <header class="od-header">
      <div class="od-header-content">
        <button class="back-btn" @click="goBack">← Back</button>
        <div class="brand-name">Order Details</div>
        <div style="width: 80px;"></div>
      </div>
    </header>

    <main class="od-body">
      <div class="od-container">

        <!-- Loading -->
        <div v-if="loading" class="od-loading">
          <div class="spinner"></div>
          <p>Loading order details...</p>
        </div>

        <!-- Order Card -->
        <div v-else-if="order" class="order-detail-card">

          <!-- Order Header -->
          <div class="order-head">
            <div>
              <div class="order-num">Order #{{ String(order.id).padStart(4, '0') }}</div>
              <div class="order-time">Placed on {{ formatDate(order.createdAt) }}</div>
            </div>
            <span class="status-pill" :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </div>

          <div class="od-divider"></div>

          <!-- Customer Info -->
          <div class="section">
            <div class="section-label">👤 Customer</div>
            <div class="customer-card">
              <div class="customer-avatar">{{ order.customerName.charAt(0).toUpperCase() }}</div>
              <div>
                <div class="customer-name">{{ order.customerName }}</div>
                <div class="customer-contact">{{ order.customerContact }}</div>
              </div>
            </div>
          </div>

          <div class="od-divider"></div>

          <!-- Items -->
          <div class="section">
            <div class="section-label">🛒 Items Ordered</div>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="item-row">
                <div class="item-left">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-qty">x{{ item.quantity }} @ ₱{{ item.price }}</div>
                </div>
                <div class="item-subtotal">₱{{ item.subtotal }}</div>
              </div>
            </div>
          </div>

          <div class="od-divider"></div>

          <!-- Total -->
          <div class="total-row">
            <span class="total-label">Total</span>
            <span class="total-amount">₱{{ order.totalAmount }}</span>
          </div>

          <!-- Admin Status Update (only for admin) -->
          <div v-if="isAdmin" class="admin-actions">
            <div class="admin-actions-label">🔧 Update Status</div>
            <div class="status-btns">
              <button
                v-for="s in statuses"
                :key="s.value"
                class="status-action-btn"
                :class="[s.cls, { active: order.status === s.value }]"
                :disabled="order.status === s.value"
                @click="updateStatus(s.value)"
              >
                {{ s.label }}
              </button>
            </div>
          </div>

          <!-- User view order message (only for users) -->
          <div v-if="!isAdmin" class="user-status-banner" :class="getStatusClass(order.status)">
            <span class="banner-emoji">{{ getStatusEmoji(order.status) }}</span>
            <div>
              <div class="banner-title">{{ order.status }}</div>
              <div class="banner-sub">{{ getStatusMessage(order.status) }}</div>
            </div>
          </div>

        </div>

        <!-- Not Found -->
        <div v-else class="od-not-found">
          <div style="font-size: 56px;">😕</div>
          <h2>Order Not Found</h2>
          <p>The requested order does not exist.</p>
          <button class="go-back-btn" @click="$router.push('/menu')">Go to Menu</button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth.service.js';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const order = ref(null);
const loading = ref(true);

const isAdmin = computed(() => authService.isAdmin());

const statuses = [
  { value: 'Pending', label: '⏳ Pending', cls: 'btn-pending' },
  { value: 'Preparing', label: '👨‍🍳 Preparing', cls: 'btn-preparing' },
  { value: 'Ready', label: '✅ Ready', cls: 'btn-ready' },
  { value: 'Completed', label: '🎉 Completed', cls: 'btn-completed' },
  { value: 'Cancelled', label: '❌ Cancelled', cls: 'btn-cancelled' }
];

const goBack = () => {
  if (authService.isAdmin()) {
    router.push('/admin');
  } else {
    router.push('/my-orders');
  }
};

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
    if (status === 'Cancelled') {
      $q.notify({ color: 'warning', message: 'Order cancelled and removed' });
      goBack();
      return;
    }
    order.value.status = status;
    $q.notify({ color: 'positive', message: `Status updated to ${status}` });
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Failed to update status' });
  }
};

const getStatusClass = (status) => {
  const map = {
    Pending: 'status-pending',
    Preparing: 'status-preparing',
    Ready: 'status-ready',
    Completed: 'status-completed',
    Cancelled: 'status-cancelled'
  };
  return map[status] || '';
};

const getStatusEmoji = (status) => {
  const map = { Pending: '⏳', Preparing: '👨‍🍳', Ready: '🔔', Completed: '🎉', Cancelled: '❌' };
  return map[status] || '📋';
};

const getStatusMessage = (status) => {
  const map = {
    Pending: 'Your order is received and waiting to be prepared.',
    Preparing: 'The kitchen is preparing your order right now!',
    Ready: 'Your order is ready for pickup!',
    Completed: 'Your order has been completed. Enjoy your meal!',
    Cancelled: 'This order has been cancelled.'
  };
  return map[status] || '';
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

onMounted(fetchOrder);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { font-family: 'Inter', sans-serif; box-sizing: border-box; }

.order-details-page {
  background: #f7f9fc;
  min-height: 100vh;
}

/* Header */
.od-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.od-header-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: none;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.back-btn:hover {
  border-color: #ff5e62;
  color: #ff5e62;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Body */
.od-body {
  padding: 40px 24px;
}

.od-container {
  max-width: 600px;
  margin: 0 auto;
}

/* Loading */
.od-loading {
  text-align: center;
  padding: 60px 0;
  color: #aaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #ff5e62;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Order Card */
.order-detail-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  overflow: hidden;
}

.order-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 28px 20px;
}

.order-num {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.order-time {
  font-size: 13px;
  color: #aaa;
  margin-top: 4px;
}

.status-pill {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 30px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.status-pending { background: #fff3e0; color: #e65100; }
.status-preparing { background: #e3f2fd; color: #1565c0; }
.status-ready { background: #e0f2f1; color: #00695c; }
.status-completed { background: #e8f5e9; color: #2e7d32; }
.status-cancelled { background: #ffebee; color: #c62828; }

.od-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 0 28px;
}

.section {
  padding: 20px 28px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #aaa;
  margin-bottom: 12px;
}

.customer-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.customer-name {
  font-weight: 700;
  font-size: 16px;
  color: #1a1a1a;
}

.customer-contact {
  font-size: 13px;
  color: #aaa;
}

/* Items */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 12px;
}

.item-name {
  font-weight: 700;
  font-size: 15px;
  color: #1a1a1a;
}

.item-qty {
  font-size: 13px;
  color: #aaa;
  margin-top: 2px;
}

.item-subtotal {
  font-weight: 700;
  font-size: 16px;
  color: #ff5e62;
}

/* Total */
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
}

.total-label {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.total-amount {
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

/* Admin Actions */
.admin-actions {
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  padding: 20px 28px;
}

.admin-actions-label {
  font-size: 13px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.status-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-action-btn {
  border: 1.5px solid;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  background: white;
}

.status-action-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.btn-pending { border-color: #e65100; color: #e65100; }
.btn-pending:not(:disabled):hover { background: #fff3e0; }

.btn-preparing { border-color: #1565c0; color: #1565c0; }
.btn-preparing:not(:disabled):hover { background: #e3f2fd; }

.btn-ready { border-color: #00695c; color: #00695c; }
.btn-ready:not(:disabled):hover { background: #e0f2f1; }

.btn-completed { border-color: #2e7d32; color: #2e7d32; }
.btn-completed:not(:disabled):hover { background: #e8f5e9; }

.btn-cancelled { border-color: #c62828; color: #c62828; }
.btn-cancelled:not(:disabled):hover { background: #ffebee; }

/* User Banner */
.user-status-banner {
  margin: 0 28px 24px;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.banner-emoji {
  font-size: 36px;
  flex-shrink: 0;
}

.banner-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 4px;
}

.banner-sub {
  font-size: 14px;
  opacity: 0.75;
  line-height: 1.4;
}

/* Not found */
.od-not-found {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

.od-not-found h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 16px 0 8px;
}

.od-not-found p {
  color: #888;
  margin-bottom: 24px;
}

.go-back-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.25s ease;
}

.go-back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255,94,98,0.3);
}
</style>
