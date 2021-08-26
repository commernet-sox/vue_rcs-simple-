import Vue from 'vue';
import VueRouter from 'vue-router';
import RcsNew from '../views/RCSNew/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'RcsNew',
    component: RcsNew,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
