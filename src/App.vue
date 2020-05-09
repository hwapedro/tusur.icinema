<template>
  <div class="page-wrap">
    <Header />
    <router-view></router-view>
    <div id="push-bottom"></div>
    <CinemaSelectOverlay :modalActive="modalActive" 
      @cinema-selected="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
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
import CinemaSelectOverlay from './core/CinemaSelectOverlay.vue';

@Component({
  components: {
    Header,
    Footer,
    CinemaSelectOverlay
  }
})
export default class App extends Vue {
  modalActive: boolean = false;
  modalTimeout: any = null;

  created() {
    MainModule.fetchAll();
    const cinema = localStorage.getItem('cinema');
    if (cinema) {
      MainModule.setCinema(cinema);
    } else {
      this.modalActive = true;
    }
  }

  closeModal() {
    this.modalActive = false;
  }

  @Watch('cinema', { immediate: false })
  onCinemaChange(cinema) {
    if (!cinema) {
      // suggest to select
      this.modalActive = true;
    }
  }

  @Watch('modalActive')
  onModalActiveChange(newval: boolean) {
    clearTimeout(this.modalTimeout);
    setTimeout(() => {
      document.querySelector('html').classList[(newval === true) ? 'add' : 'remove']('is-clipped');
    }, 100)
  }

  get cinema() {
    return MainModule.cinema;
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
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
