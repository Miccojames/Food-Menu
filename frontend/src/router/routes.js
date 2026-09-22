import IndexPage from '../pages/IndexPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import OrdersPage from '../pages/OrdersPage.vue';
import OrderDetailsPage from '../pages/OrderDetailsPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import MyOrdersPage from '../pages/MyOrdersPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/menu',
    component: IndexPage
  },
  {
    path: '/admin',
    component: AdminPage
  },
  {
    path: '/orders',
    component: OrdersPage
  },
  {
    path: '/orders/:id',
    component: OrderDetailsPage
  },
  {
    path: '/my-orders',
    component: MyOrdersPage
  },
  {
    path: '/:catchAll(.*)*',
    component: LoginPage // fallback to login
  }
];

export default routes;
