import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/core/Home/Home.vue';
import Soon from '@/core/Soon/Soon.vue';
import Timetable from '@/core/Timetable/Timetable.vue';
import PickSeat from '@/core/PickSeat/PickSeat.vue';
import FilmPage from '@/core/Film/Film.vue';
import NewsPage from '@/core/NewsPage/NewsPage.vue';
import ThanksPage from '@/core/Done/Thanks.vue';
import { isDev } from '@/shared/constants';

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
  {
    path: '/showtime/:showtimeId',
    props: true,
    name: 'Выбор мест',
    component: PickSeat,
    meta: {
      inHeader: false,
    }
  },
  {
    path: '/film/:filmId',
    props: true,
    name: 'Фильм',
    component: FilmPage,
    meta: {
      inHeader: false,
    }
  },
  {
    path: '/news/:newsId',
    props: true,
    name: 'Новости',
    component: NewsPage,
    meta: {
      inHeader: false,
    }
  },
  {
    path: '/thank-you',
    props: true,
    name: 'Спасибо',
    component: ThanksPage,
    meta: {
      inHeader: false,
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
