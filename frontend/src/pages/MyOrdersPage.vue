<template>
  <div class="my-orders-page">

    <!-- Header -->
    <header class="orders-header">
      <div class="header-content">
        <button class="back-btn" @click="$router.push('/menu')">
          <span>←</span> Back to Menu
        </button>
        <div class="brand">
          <span class="brand-name">My Orders</span>
        </div>
        <button class="logout-btn" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>

    <!-- Page Body -->
    <main class="orders-body">
      <div class="orders-container">

        <div class="orders-hero">
          <div class="hero-avatar">📋</div>
          <h1 class="hero-title">Your Order History</h1>
          <p class="hero-sub">Hello, <strong>{{ userName }}</strong>! Here are all your placed orders.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="orders-loading">
          <div class="spinner"></div>
          <p>Fetching your orders...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="orders.length === 0" class="orders-empty">
          <div class="empty-icon">🍽️</div>
          <h2>No orders yet!</h2>
          <p>You haven't placed any orders. Go explore our menu!</p>
          <button class="go-menu-btn" @click="$router.push('/menu')">Browse Menu</button>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-card"
            @click="$router.push(`/orders/${order.id}`)"
          >
            <div class="order-card-left">
              <div class="order-number">#{{ String(order.id).padStart(4, '0') }}</div>
              <div class="order-items-preview">
                {{ order.items.map(i => i.name).join(', ') }}
              </div>
              <div class="order-date">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div class="order-card-right">
              <div class="order-total">₱{{ order.totalAmount }}</div>
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
              <div class="view-btn">View Details →</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { orderService } from '../services/order.service.js';
import { authService } from '../services/auth.service.js';

const router = useRouter();
const user = authService.getUser();
const userName = user?.username || 'Guest';
const orders = ref([]);
const loading = ref(true);

const logout = () => {
  authService.logout();
  router.push('/login');
};

const fetchMyOrders = async () => {
  loading.value = true;
  try {
    const res = await orderService.getOrders();
    // Filter by user name stored locally
    orders.value = res.data.filter(
      o => o.customerName.toLowerCase() === userName.toLowerCase()
    );
  } catch (err) {
    console.error('Failed to fetch orders', err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
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

onMounted(fetchMyOrders);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.my-orders-page {
  background: #f7f9fc;
  min-height: 100vh;
}

/* Header */
.orders-header {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn, .logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 30px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  height: 38px;
}

.back-btn:hover {
  border-color: #ff5e62;
  color: #ff5e62;
  background: #fff5f5;
}

.logout-btn:hover {
  border-color: #e53e3e;
  color: #e53e3e;
  background: #fff5f5;
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Body */
.orders-body {
  padding: 48px 24px;
}

.orders-container {
  max-width: 760px;
  margin: 0 auto;
}

.orders-hero {
  text-align: center;
  margin-bottom: 40px;
}

.hero-avatar {
  font-size: 56px;
  margin-bottom: 12px;
}

.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -1px;
  margin: 0 0 8px;
}

.hero-sub {
  font-size: 15px;
  color: #888;
  margin: 0;
}

/* Loading */
.orders-loading {
  text-align: center;
  padding: 60px 0;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #ff5e62;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty */
.orders-empty {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.orders-empty h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.orders-empty p {
  color: #888;
  margin: 0 0 24px;
}

.go-menu-btn {
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

.go-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255,94,98,0.3);
}

/* Orders List */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: white;
  border-radius: 20px;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.03);
  cursor: pointer;
  transition: all 0.25s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.order-card-left {
  flex: 1;
  min-width: 0;
}

.order-number {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.order-items-preview {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
  margin-bottom: 4px;
}

.order-date {
  font-size: 12px;
  color: #aaa;
  font-weight: 500;
}

.order-card-right {
  text-align: right;
  flex-shrink: 0;
  margin-left: 16px;
}

.order-total {
  font-size: 22px;
  font-weight: 800;
  color: #ff5e62;
  margin-bottom: 8px;
}

.order-status {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 30px;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
}

.status-pending { background: #fff3e0; color: #e65100; }
.status-preparing { background: #e3f2fd; color: #1565c0; }
.status-ready { background: #e0f2f1; color: #00695c; }
.status-completed { background: #e8f5e9; color: #2e7d32; }
.status-cancelled { background: #ffebee; color: #c62828; }

.view-btn {
  font-size: 12px;
  font-weight: 600;
  color: #aaa;
}

.order-card:hover .view-btn {
  color: #ff5e62;
}
</style>
