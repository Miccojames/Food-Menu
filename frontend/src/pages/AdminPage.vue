<template>
  <div class="admin-root">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="sidebar-logo">🍽️</span>
        <div>
          <div class="sidebar-title">BiteBoard</div>
          <div class="sidebar-subtitle">Admin Panel</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          class="nav-item"
          :class="{ active: tab === 'dashboard' }"
          @click="tab = 'dashboard'"
        >
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </button>
        <button
          class="nav-item"
          :class="{ active: tab === 'foods' }"
          @click="tab = 'foods'"
        >
          <span class="nav-icon">🍔</span>
          <span>Food Menu</span>
        </button>
        <button
          class="nav-item"
          :class="{ active: tab === 'orders' }"
          @click="tab = 'orders'"
        >
          <span class="nav-icon">📦</span>
          <span>Orders</span>
          <span v-if="pendingCount > 0" class="nav-badge">{{ pendingCount }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-nav-btn" @click="logout">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">

      <!-- Top Bar -->
      <div class="topbar">
        <div class="topbar-title">
          <span v-if="tab === 'dashboard'">📊 Dashboard Overview</span>
          <span v-else-if="tab === 'foods'">🍔 Food Menu</span>
          <span v-else-if="tab === 'orders'">📦 Customer Orders</span>
        </div>
        <div class="topbar-right">
          <div class="admin-badge">
            <span>👤</span> Admin
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="admin-content">

        <!-- ===== DASHBOARD TAB ===== -->
        <div v-if="tab === 'dashboard'" class="tab-panel">
          <div class="stats-grid">
            <div class="stat-card stat-orange">
              <div class="stat-icon">📦</div>
              <div class="stat-body">
                <div class="stat-value">{{ orders.length }}</div>
                <div class="stat-label">Total Orders</div>
              </div>
            </div>
            <div class="stat-card stat-purple">
              <div class="stat-icon">⏳</div>
              <div class="stat-body">
                <div class="stat-value">{{ pendingCount }}</div>
                <div class="stat-label">Pending Orders</div>
              </div>
            </div>
            <div class="stat-card stat-green">
              <div class="stat-icon">✅</div>
              <div class="stat-body">
                <div class="stat-value">{{ completedCount }}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
            <div class="stat-card stat-blue">
              <div class="stat-icon">🍽️</div>
              <div class="stat-body">
                <div class="stat-value">{{ foods.length }}</div>
                <div class="stat-label">Menu Items</div>
              </div>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="section-header">
            <h2 class="section-title">Recent Orders</h2>
            <button class="view-all-btn" @click="tab = 'orders'">View All →</button>
          </div>

          <div class="modern-table-card">
            <table class="mtable">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in orders.slice(0, 5)"
                  :key="order.id"
                  class="table-row clickable"
                  @click="$router.push(`/orders/${order.id}`)"
                >
                  <td class="td-order-id">#{{ String(order.id).padStart(4, '0') }}</td>
                  <td class="td-customer">
                    <div class="customer-info">
                      <div class="customer-avatar">{{ order.customerName.charAt(0).toUpperCase() }}</div>
                      <div>
                        <div class="customer-name">{{ order.customerName }}</div>
                        <div class="customer-contact">{{ order.customerContact }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="td-total">₱{{ order.totalAmount }}</td>
                  <td>
                    <span class="status-pill" :class="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="td-date">{{ formatDate(order.createdAt) }}</td>
                </tr>
                <tr v-if="orders.length === 0">
                  <td colspan="5" class="empty-row">No orders yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ===== FOODS TAB ===== -->
        <div v-if="tab === 'foods'" class="tab-panel">
          <div class="section-header">
            <h2 class="section-title">Food Menu</h2>
            <button class="add-btn" @click="openAddDialog">
              + Add New Food
            </button>
          </div>

          <div class="modern-table-card">
            <div v-if="loading" class="table-loading">
              <div class="spinner"></div>
              Loading foods...
            </div>
            <table v-else class="mtable">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="food in foods" :key="food.id" class="table-row">
                  <td>
                    <img :src="food.image" class="food-thumb" :alt="food.name" />
                  </td>
                  <td class="td-food-name">
                    <div class="food-name">{{ food.name }}</div>
                    <div class="food-desc">{{ food.description?.slice(0, 40) }}...</div>
                  </td>
                  <td>
                    <span class="category-tag">{{ food.category }}</span>
                  </td>
                  <td class="td-price">₱{{ food.price }}</td>
                  <td>
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        :checked="food.available"
                        @change="toggleAvailability(food)"
                      />
                      <span class="toggle-track"></span>
                    </label>
                  </td>
                  <td class="td-actions">
                    <button class="action-btn edit" @click="openEditDialog(food)">✏️ Edit</button>
                    <button class="action-btn delete" @click="confirmDelete(food)">🗑️ Delete</button>
                  </td>
                </tr>
                <tr v-if="foods.length === 0">
                  <td colspan="6" class="empty-row">No food items found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ===== ORDERS TAB ===== -->
        <div v-if="tab === 'orders'" class="tab-panel">
          <div class="section-header">
            <h2 class="section-title">Customer Orders</h2>
            <button class="refresh-btn" @click="loadOrders">🔄 Refresh</button>
          </div>

          <div class="modern-table-card">
            <div v-if="loadingOrders" class="table-loading">
              <div class="spinner"></div>
              Loading orders...
            </div>
            <table v-else class="mtable">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="order in orders"
                  :key="order.id"
                  class="table-row"
                >
                  <td class="td-order-id">#{{ String(order.id).padStart(4, '0') }}</td>
                  <td class="td-customer">
                    <div class="customer-info">
                      <div class="customer-avatar">{{ order.customerName.charAt(0).toUpperCase() }}</div>
                      <div>
                        <div class="customer-name">{{ order.customerName }}</div>
                        <div class="customer-contact">{{ order.customerContact }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="td-items">{{ order.items?.length || 0 }} item(s)</td>
                  <td class="td-total">₱{{ order.totalAmount }}</td>
                  <td>
                    <span class="status-pill" :class="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="td-date">{{ formatDate(order.createdAt) }}</td>
                  <td>
                    <button class="view-order-btn" @click="$router.push(`/orders/${order.id}`)">
                      View →
                    </button>
                  </td>
                </tr>
                <tr v-if="orders.length === 0">
                  <td colspan="7" class="empty-row">No orders yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

    <!-- ===== FOOD DIALOG ===== -->
    <div class="modal-overlay" v-if="dialog" @click.self="dialog = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEdit ? '✏️ Edit Food' : '➕ Add New Food' }}</h3>
          <button class="modal-close" @click="dialog = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveFood">
            <div class="modal-grid">
              <div class="mform-group">
                <label class="mform-label">Food Name</label>
                <input v-model="form.name" type="text" class="mform-input" placeholder="e.g. Burger Deluxe" required />
              </div>
              <div class="mform-group">
                <label class="mform-label">Category</label>
                <select v-model="form.category" class="mform-input" required>
                  <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="mform-group">
                <label class="mform-label">Price (₱)</label>
                <input v-model.number="form.price" type="number" class="mform-input" placeholder="0.00" required />
              </div>
              <div class="mform-group">
                <label class="mform-label">Image URL</label>
                <input v-model="form.image" type="text" class="mform-input" placeholder="https://..." required />
              </div>
            </div>
            <div class="mform-group">
              <label class="mform-label">Description</label>
              <textarea v-model="form.description" class="mform-input mform-textarea" placeholder="Short description..." required></textarea>
            </div>
            <div class="mform-toggles">
              <label class="toggle-label">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="form.spicy" />
                  <span class="toggle-track"></span>
                </label>
                🌶️ Spicy
              </label>
              <label class="toggle-label">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="form.vegetarian" />
                  <span class="toggle-track"></span>
                </label>
                🥗 Vegetarian
              </label>
              <label class="toggle-label">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="form.available" />
                  <span class="toggle-track"></span>
                </label>
                ✅ Available
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" class="cancel-btn" @click="dialog = false">Cancel</button>
              <button type="submit" class="submit-btn">{{ isEdit ? 'Save Changes' : 'Add Food' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { foodService } from '../services/food.service';
import { categoryService } from '../services/category.service';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth.service.js';

const $q = useQuasar();
const router = useRouter();

const tab = ref('dashboard');
const foods = ref([]);
const categories = ref([]);
const categoryOptions = ref([]);
const loading = ref(false);
const orders = ref([]);
const loadingOrders = ref(false);
const dialog = ref(false);
const isEdit = ref(false);
const currentId = ref(null);

const form = ref({
  name: '',
  category: '',
  price: 0,
  description: '',
  image: '',
  spicy: false,
  vegetarian: false,
  available: true
});

const pendingCount = computed(() =>
  orders.value.filter(o => o.status === 'Pending').length
);

const completedCount = computed(() =>
  orders.value.filter(o => o.status === 'Completed').length
);

const logout = () => {
  authService.logout();
  router.push('/login');
};

const loadData = async () => {
  loading.value = true;
  try {
    const [foodsRes, catsRes] = await Promise.all([
      foodService.getFoods(),
      categoryService.getCategories()
    ]);
    foods.value = foodsRes.data;
    categories.value = catsRes.data;
    categoryOptions.value = catsRes.data.map(c => c.name);
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Failed to load food data' });
  } finally {
    loading.value = false;
  }
};

const loadOrders = async () => {
  loadingOrders.value = true;
  try {
    const res = await orderService.getOrders();
    orders.value = res.data;
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Failed to load orders' });
  } finally {
    loadingOrders.value = false;
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

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const openAddDialog = () => {
  isEdit.value = false;
  currentId.value = null;
  form.value = {
    name: '',
    category: categoryOptions.value[0] || '',
    price: 0,
    description: '',
    image: '',
    spicy: false,
    vegetarian: false,
    available: true
  };
  dialog.value = true;
};

const openEditDialog = (food) => {
  isEdit.value = true;
  currentId.value = food.id;
  form.value = { ...food };
  dialog.value = true;
};

const saveFood = async () => {
  try {
    if (isEdit.value) {
      await foodService.updateFood(currentId.value, form.value);
      $q.notify({ color: 'positive', message: 'Food updated successfully' });
    } else {
      await foodService.createFood(form.value);
      $q.notify({ color: 'positive', message: 'Food added successfully' });
    }
    dialog.value = false;
    loadData();
  } catch (error) {
    $q.notify({ color: 'negative', message: error.message || 'Failed to save food' });
  }
};

const toggleAvailability = async (food) => {
  food.available = !food.available;
  try {
    await foodService.updateFood(food.id, { available: food.available });
    $q.notify({ color: 'positive', message: 'Availability updated' });
  } catch (error) {
    food.available = !food.available; // revert
    $q.notify({ color: 'negative', message: 'Failed to update' });
  }
};

const confirmDelete = (food) => {
  $q.dialog({
    title: 'Delete Food',
    message: `Are you sure you want to delete "${food.name}"?`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    try {
      await foodService.deleteFood(food.id);
      $q.notify({ color: 'positive', message: 'Food deleted' });
      loadData();
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Failed to delete' });
    }
  });
};

onMounted(() => {
  loadData();
  loadOrders();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* { font-family: 'Inter', sans-serif; box-sizing: border-box; }

/* Root layout */
.admin-root {
  display: flex;
  min-height: 100vh;
  background: #f0f2f7;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 250px;
  min-height: 100vh;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-logo {
  font-size: 28px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

.sidebar-subtitle {
  font-size: 11px;
  color: #aaa;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #777;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  position: relative;
}

.nav-item:hover {
  background: #f7f0ff;
  color: #7c3aed;
}

.nav-item.active {
  background: linear-gradient(135deg, #fff0f0, #fff5f0);
  color: #ff5e62;
}

.nav-icon {
  font-size: 18px;
}

.nav-badge {
  margin-left: auto;
  background: #ff5e62;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 30px;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid #f0f0f0;
}

.logout-nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #e53e3e;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease;
}

.logout-nav-btn:hover {
  background: #fff5f5;
}

/* ===== MAIN CONTENT ===== */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.admin-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 30px;
}

.admin-content {
  padding: 32px;
  flex: 1;
}

.tab-panel {
  animation: fadeUp 0.3s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Stat Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}

.stat-card {
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.stat-orange { background: linear-gradient(135deg, #ff5e62, #ff9966); color: white; }
.stat-purple { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.stat-green  { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; }
.stat-blue   { background: linear-gradient(135deg, #2193b0, #6dd5ed); color: white; }

.stat-icon {
  font-size: 36px;
  opacity: 0.85;
}

.stat-value {
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.8;
  margin-top: 4px;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0;
}

.view-all-btn, .refresh-btn {
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

.view-all-btn:hover, .refresh-btn:hover {
  border-color: #ff5e62;
  color: #ff5e62;
}

.add-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 6px 16px rgba(255,94,98,0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(255,94,98,0.4);
}

/* Table Card */
.modern-table-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.04);
}

.table-loading {
  padding: 48px;
  text-align: center;
  color: #aaa;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #eee;
  border-top-color: #ff5e62;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.mtable {
  width: 100%;
  border-collapse: collapse;
}

.mtable thead tr {
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.mtable th {
  text-align: left;
  padding: 14px 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #999;
}

.mtable td {
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
}

.table-row:last-child td { border-bottom: none; }

.table-row:hover td { background: #fffaf9; }

.table-row.clickable { cursor: pointer; }

.empty-row {
  text-align: center;
  color: #bbb;
  padding: 40px !important;
  font-size: 14px;
}

/* Table cells */
.td-order-id {
  font-weight: 800;
  color: #ff5e62 !important;
  font-size: 15px !important;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.customer-name {
  font-weight: 700;
  font-size: 14px;
  color: #222;
}

.customer-contact {
  font-size: 12px;
  color: #aaa;
}

.td-total {
  font-weight: 700 !important;
  color: #1a1a1a !important;
}

.td-date {
  font-size: 12px !important;
  color: #aaa !important;
}

.td-items {
  color: #666 !important;
}

/* Status Pills */
.status-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 30px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.status-pending { background: #fff3e0; color: #e65100; }
.status-preparing { background: #e3f2fd; color: #1565c0; }
.status-ready { background: #e0f2f1; color: #00695c; }
.status-completed { background: #e8f5e9; color: #2e7d32; }
.status-cancelled { background: #ffebee; color: #c62828; }

/* Food table specific */
.food-thumb {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
}

.td-food-name {
  max-width: 220px;
}

.food-name {
  font-weight: 700;
  color: #222;
}

.food-desc {
  font-size: 12px;
  color: #aaa;
  margin-top: 2px;
}

.category-tag {
  background: #f0f0f0;
  color: #555;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.td-price {
  font-weight: 700 !important;
  color: #ff5e62 !important;
}

.td-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.action-btn.edit {
  background: #f0f4ff;
  color: #4361ee;
}

.action-btn.edit:hover {
  background: #dce8ff;
}

.action-btn.delete {
  background: #fff0f0;
  color: #e53e3e;
}

.action-btn.delete:hover {
  background: #ffe4e4;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #ddd;
  border-radius: 22px;
  transition: 0.3s;
}

.toggle-track::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle-switch input:checked + .toggle-track {
  background: #ff5e62;
}

.toggle-switch input:checked + .toggle-track::before {
  transform: translateX(18px);
}

.view-order-btn {
  background: none;
  border: 1.5px solid #e5e5e5;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.view-order-btn:hover {
  border-color: #ff5e62;
  color: #ff5e62;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.3px;
}

.modal-close {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  transition: background 0.2s ease;
}

.modal-close:hover {
  background: #eee;
}

.modal-body {
  padding: 24px 28px;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.mform-group {
  margin-bottom: 16px;
}

.mform-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #555;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.mform-input {
  width: 100%;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Inter', sans-serif;
  background: white;
}

.mform-input:focus {
  border-color: #ff5e62;
  box-shadow: 0 0 0 3px rgba(255,94,98,0.1);
}

.mform-textarea {
  resize: vertical;
  min-height: 80px;
}

.mform-toggles {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  background: none;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  border-color: #ccc;
}

.submit-btn {
  background: linear-gradient(135deg, #ff5e62, #ff9966);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.25s ease;
  box-shadow: 0 6px 16px rgba(255,94,98,0.3);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255,94,98,0.4);
}
</style>
