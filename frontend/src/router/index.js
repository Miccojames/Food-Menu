import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes.js';
import { authService } from '../services/auth.service.js';

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = authService.isLoggedIn();
  const user = authService.getUser();

  if (to.path === '/login') {
    if (loggedIn) {
      if (user?.role === 'admin') return next('/admin');
      return next('/menu');
    }
    return next();
  }

  if (!loggedIn) {
    return next('/login');
  }

  if (to.path === '/admin' && user?.role !== 'admin') {
    return next('/menu');
  }

  next();
});

export default router;
