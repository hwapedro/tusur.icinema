<template>
  <div class="page-wrap">
    <Header />
    <router-view></router-view>
    <div
      id="push-bottom"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import './assets/bulma.min.css';
import Header from './shared/components/Header.vue';
import Footer from './shared/components/Footer.vue';
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { MainModule } from "./store/modules/main";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class App extends Vue {
  created() {
    MainModule.fetchAll();
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.page-wrap {
  position: relative;
}
html {
  overflow-y: auto;
}
</style>
