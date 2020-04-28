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
          class="timetable-row columns"
          v-for="(filmHallsObj, filmId) in showtimes[date]"
          :key="filmId"
        >
          <div class="column is-4">
            <!-- left part of row -->
            <div class="columns">
              <div class="column is-5">
                <img
                  :src="films[filmId].image"
                  alt="film image"
                >
              </div>
              <div class="column">
                <div class="film__title title is-3">{{ films[filmId].name }}</div>
                <div class="film-prop">
                  <div class="film-prop__title subtitle is-5 is-marginless">Жанр:</div>
                  <div class="film-prop__value">{{ filmGenres(filmId) }}</div>
                </div>
                <div class="film-prop">
                  <div class="film-prop__title subtitle is-5 is-marginless">Продолжительность:</div>
                  <div class="film-prop__value">{{ filmLength(filmId) }}</div>
                </div>
                <div class="film-prop">
                  <div class="film-prop__title subtitle is-5 is-marginless">Цена билета:</div>
                  <div class="film-prop__value">{{ showtimePrices(filmHallsObj) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <!-- right part -->
            <div class="halls">
              <div
                v-for="(filmShowtimesObj, hallId, hallIndex) in filmHallsObj"
                :key="hallId"
                class="hall-row"
              >
                <div
                  class="showtime"
                  v-for="(showtime) in filmShowtimesObj"
                  :key="showtime._id"
                >
                  <span
                    class="showtime__bubble tag is-normal"
                    :style="calculateShowtimeBubbleCss(showtime, hallIndex)"
                  >{{ formatShowtimeBubbleTime(showtime.time) }}</span>
                  <!-- modal window with seat info and payment button -->
                  <!-- <div>Time: {{ new Date(showtime.time).toLocaleString() }}</div>
                  <div>Hall: {{ halls[showtime.hall] && halls[showtime.hall].name }}</div>
                  <router-link
                    :to="`/showtime/${showtime._id}`"
                    v-slot="{ href, route, navigate}"
                  >
                    <a
                      class="button is-primary"
                      @click="navigate"
                      :href="href"
                    >К выбору мест</a>
                  </router-link> -->
                </div>
              </div>
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
import { ModelMap } from "../../types";
import { Genre, Showtime, Hall, HallCell, AgeRule, Cinema, Film } from '../../store/models';
import { formatPrice } from '../../shared/utils';
import moment from 'moment';
import { HOURS_MERGED } from '../../shared/constants';

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

  filmGenres(filmId: string): string {
    if (!this.films[filmId])
      return '';
    return this.films[filmId].genres.map(genreId => this.genres[<any>genreId as string].name).join(', ');
  }
  filmLength(filmId: string): string {
    if (!this.films[filmId])
      return '';
    const len = this.films[filmId].duration;
    if (len > 60) {
      return `${Math.floor(len / 60)} ч ${len % 60} мин`;
    }
    return `${len % 60} мин`;
  }
  showtimePrices(filmHallsObj: { [hallId: string]: (Showtime & { min: number, max: number })[] }) {
    // get min and max prices
    // convert to set
    const minmaxes = Object.values(filmHallsObj)
      .map(showtimes => {
        return showtimes.reduce((acc, curr) => {
          if (curr.min < acc.min)
            acc.min = curr.min;
          if (curr.max > acc.max)
            acc.max = curr.max;
          return acc;
        }, {
          min: showtimes[0].min,
          max: showtimes[0].max,
        });
      });
    let min = minmaxes[0].min,
      max = minmaxes[0].max;
    for (const minmax of minmaxes) {
      if (minmax.min < min)
        min = minmax.min;
      if (minmax.max > max)
        max = minmax.max;
    }
    return min === max ? formatPrice(min, true) : `${formatPrice(min, false)} - ${formatPrice(max, true)}`
  }

  formatShowtimeBubbleTime(time: number | string) {
    return moment(time).format('HH:mm');
  }
  calculateShowtimeBubbleCss(showtime: any, hallIndex) {
    // todo: color
    const color = this.hallColors[Math.min(hallIndex, this.hallColors.length - 1)];
    const time = moment(showtime.time);
    const maxHour = this.endHour + 1;

    const hourWidth = window.$('.hour').eq(0).outerWidth();
    const hourish = moment.duration(time.hours() * 60 + time.minutes(), 'minutes').asHours();
    console.log(hourish, hourWidth);
    const offset = hourish / maxHour * 100; // %
    // const offset = hourish * hourWidth / HOURS_MERGED;
    return {
      'background-color': color,
      'left': `${offset}%`,
    }
  }

  get hallColors(): string[] {
    return [
      '#17C3B2',
      '#ffcb77',
      '#557C9D',
      '#fe6d73',
      '#F6C0D0',
    ];
  }

  get films(): ModelMap<Film> {
    return MainModule.films;
  }
  get showtimes() {
    return MainModule.dateShowtimes;
  }
  get halls(): ModelMap<Hall> {
    return MainModule.halls;
  }
  get hallCells(): ModelMap<HallCell> {
    return MainModule.hallCells;
  }
  get genres(): ModelMap<Genre> {
    return MainModule.genres;
  }
  get ageRules(): ModelMap<AgeRule> {
    return MainModule.ageRules;
  }
  get cinema(): string {
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
.timetable {
  .row {
    width: 100%;
  }
}
.film-prop {
  margin-bottom: 0.5rem;
  &__title {
    font-size: 1.1rem;
    color: #ad2cbe;
  }
  &__value {
  }
}
.halls {
  margin-top: 100px;
  .hall-row {
    position: relative;
    width: 100%;
    height: 30px;

    .showtime__bubble {
      cursor: pointer;
      position: absolute;
    }
  }
}
</style>