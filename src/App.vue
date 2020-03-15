<template>
  <div class="columns">
    <div class="column">
      <Header />
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import './assets/bulma.min.css';
import Header from './components/Header.vue';
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';

@Component({
  components: {
    Header
  }
})
export default class App extends Vue { 
  @Action fetchAll;

  created() {
    this.fetchAll();
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html {
  overflow-y: auto;
}
</style>
