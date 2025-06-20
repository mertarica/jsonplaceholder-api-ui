import { createRouter, createWebHistory } from 'vue-router';

// Lazy-loaded pages
const UsersListPage = () => import('@/pages/UsersListPage.vue');
const UserDetailPage = () => import('@/pages/UserDetailPage.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/users',
    },
    {
      path: '/users',
      name: 'UsersList',
      component: UsersListPage,
    },
    {
      path: '/users/:id',
      name: 'UserDetail',
      component: UserDetailPage,
      props: true,
    },
  ],
});

export default router;
