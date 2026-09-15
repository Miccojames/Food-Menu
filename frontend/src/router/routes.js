import IndexPage from '../pages/IndexPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import OrdersPage from '../pages/OrdersPage.vue';
import OrderDetailsPage from '../pages/OrderDetailsPage.vue';

const routes = [
  {
    path: '/',
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
    path: '/:catchAll(.*)*',
    component: IndexPage // fallback to index
  }
];

export default routes;
