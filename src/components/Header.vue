<template>
  <div class="container">
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
        >
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          >
        </a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu"
      >
        <div class="navbar-start">
          <router-link
            class="navbar-item"
            v-for="route in routesInHeader"
            :key="route.name"
            :to="route.path"
          >{{ route.name }}</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";
import { routes } from '@/router';

@Component
export default class Header extends Vue {
  routes = routes;

  get routesInHeader() {
    return this.routes.filter(route => route ? route.meta.inHeader : false);
  }
}
</script>

<style lang="scss" scoped>
</style>