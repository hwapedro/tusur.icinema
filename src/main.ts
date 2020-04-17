import { Component } from 'vue-property-decorator'
Component.registerHooks(['validations']);
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

Vue.config.productionTip = false;

(window as any).app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
