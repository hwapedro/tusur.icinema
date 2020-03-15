import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Soon from '../views/Soon.vue';
import Timetable from '../views/Timetable.vue';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    name: 'Главная',
    component: Home,
    meta: { 
      inHeader: false, 
    }
  },
  {
    path: '/soon',
    name: 'Афиша',
    component: Soon,
    meta: { 
      inHeader: true, 
    }
  },
  {
    path: '/timetable',
    name: 'Расписание',
    component: Timetable,
    meta: { 
      inHeader: true, 
    }
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
