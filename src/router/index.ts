import { createRouter, createWebHistory } from 'vue-router';

const UsersListPage = () => import('@/pages/UsersListPage.vue');
const UserDetailPage = () => import('@/pages/UserDetailPage.vue');
const ErrorPage = () => import('@/pages/ErrorPage.vue');

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
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: ErrorPage,
      props: { notFound: true },
    },
  ],
});

router.onError((error) => {
  console.error('Router error:', error);
  router.push('/error');
});

export default router;
