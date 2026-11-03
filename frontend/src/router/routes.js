import IndexPage from '../pages/IndexPage.vue';
import AdminPage from '../pages/AdminPage.vue';
import OrderDetailsPage from '../pages/OrderDetailsPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import MyOrdersPage from '../pages/MyOrdersPage.vue';
import ErrorNotFound from '../pages/ErrorNotFound.vue';

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
    path: '/orders/:id',
    component: OrderDetailsPage
  },
  {
    path: '/my-orders',
    component: MyOrdersPage
  },
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
];

export default routes;
