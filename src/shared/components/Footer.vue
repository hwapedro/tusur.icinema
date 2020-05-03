<template>
  <footer id="main-footer">
    <div class="content has-text-centered">
      <p>
        <strong>icinema</strong> made by Dmitry Babin and German Gorodnev.
      </p>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";
import { routes } from '../../router';
import { MainModule } from "../../store/modules/main";

@Component
export default class Header extends Vue {
  routes = routes;

  get routesInHeader() {
    return this.routes.filter(route => route ? route.meta.inHeader : false);
  }

  get cinemas() {
    return MainModule.cinemas;
  }

  get cinema() {
    return MainModule.cinema;
  }
  set cinema(val) {
    MainModule.setCinema(val);
  }
}
</script>

<style lang="scss">
body {
  position: relative;
}
#push-bottom {
  height: 85px;
}
#main-footer {
  position: absolute;
  height: 72px;
  bottom: 0;
  width: 100%;
  background: rgb(219, 219, 219);
  margin-top: 72px;
  padding: 1.5rem;
}
</style>