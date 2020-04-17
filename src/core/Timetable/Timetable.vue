<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <h1 class="title">Расписание</h1>
        <div class="calendar">
          TODO calendar
          <button
            v-for="d in Object.keys(showtimes)"
            :key="d"
            @click="setDate(d)"
          >{{d}}</button>
        </div>
        <div
          v-for="(filmShowtimesObj, filmId) in showtimes[date]"
          :key="filmId"
        >
          <div
            class="showtime-row"
            v-for="(showtime) in filmShowtimesObj"
            :key="showtime._id"
          >
            <div>Film: {{ films[filmId].name }}</div>
            <div>Time: {{ new Date(showtime.time).toLocaleString() }}</div>
            <div>Hall: {{ halls[showtime.hall].name }}</div>
            <router-link
              :to="`/showtime/${showtime._id}`"
              v-slot="{ href, route, navigate}"
            >
              <a
                class="button is-primary"
                @click="navigate"
                :href="href"
              >К выбору мест</a>
            </router-link>

            <hr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { Film, Genre, Actor } from '@/store/models';
import { MainModule } from "../../store/modules/main";

@Component
export default class Timetable extends Vue {
  date: string = '';

  mounted() {
    MainModule.fetchTimetable(new Date(Date.now() - 1000 * 3600 * 24 * 5))
      .then(r => {
        this.date = Object.keys(MainModule.dateShowtimes)[0];
      });
  }

  get films() {
    return MainModule.films;
  }
  get showtimes() {
    return MainModule.dateShowtimes;
  }
  get halls() {
    return MainModule.halls;
  }

  setDate(date) {
    this.date = date;
  }

}

</script>

<style lang="scss" scoped>
</style>