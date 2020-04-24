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

        <div class="timetable">
          <TimetableHeader
            :startHour="startHour"
            :endHour="endHour"
          />
        </div>
        <div
          class="timetable-row"
          v-for="(filmShowtimesObj, filmId) in showtimes[date]"
          :key="filmId"
        >
          <div class="left">
            <div>Film: {{ films[filmId].name }}</div>
          </div>
          <div class="right">
            <div
              class="hall-showtimes"
              v-for="(showtime) in filmShowtimesObj"
              :key="showtime._id"
            >
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch, } from "vue-property-decorator";
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { MainModule } from "../../store/modules/main";
import { Debounce } from 'vue-debounce-decorator';
import TimetableHeader from "./TimetableHeader.vue";

@Component({
  components: {
    TimetableHeader
  }
})
export default class Timetable extends Vue {
  date: string = '';

  mounted() {
    if (MainModule.cinema) {
      this.fetchTimetable();
    }
  }

  @Watch('cinema')
  onCinemaChange() {
    this.fetchTimetable();
  }

  @Debounce({ time: 500 })
  async fetchTimetable() {
    await MainModule.fetchTimetable(new Date())
    this.date = Object.keys(MainModule.dateShowtimes)[0];
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
  get cinema() {
    return MainModule.cinema;
  }

  get startHour() {
    return 0;
  }
  get endHour() {
    return 23;
  }

  setDate(date) {
    this.date = date;
  }
}

</script>

<style lang="scss">
$left: 25%;
.timetable {
  
  .left {
    width: $left;
    float: left;
  }
  .right {
    width: 100% - $left;
    float: right;
  }

  .row {
    width: 100%;
  }
}
</style>