import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import GlobalModule from './module';

export default new Vuex.Store({
  state: {},
  modules: {
    GlobalModule
  }
});
