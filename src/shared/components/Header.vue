<template>
  <nav
    class="navbar is-primary"
    id="main-navbar"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand">
        <router-link
          class="navbar-item"
          to="/"
        > {{ cinema ? cinemas[cinema].name : 'Cinema' }}</router-link>
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

      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link
            class="navbar-item"
            v-for="route in routesInHeader"
            :key="route.name"
            :to="route.path"
          >{{ route.name }}</router-link>
        </div>
        <div class="navbar-end">
          <div class="level">
            <div class="select">
              <select v-model="cinema">
                <option
                  disabled
                  value=""
                >Выберите кинотеатр</option>
                <option
                  v-for="(cinema, cinemaId) in cinemas"
                  :key="cinemaId"
                  :value="cinemaId"
                >
                  {{ cinema.name }}
                </option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  </nav>
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

<style lang="scss" scoped>
#main-navbar {
  margin-bottom: 1rem;
}
</style>