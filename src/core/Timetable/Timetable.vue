<template>
  <div class="container timetable">
    <div class="columns">
      <div class="column">
        <h1 class="title">Расписание</h1>

        <Calendar
          :dates="Object.keys(showtimes)"
          :selectedDate="date"
          @set-date="setDate"
        />

        <div class="timetable-wrap">
          <TimetableHeader
            :startHour="startHour"
            :endHour="endHour"
          />
          <div class="container timetable-entry"
            v-for="(filmHallsObj, filmId) in showtimes[date]"
            :key="filmId"
          >
            <div
              class="timetable-row columns"
            >
              <div class="column is-4 left">
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
              <div class="column right">
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
                        :style="showtimeBubbleCss(showtime, hallIndex)"
                        @mouseover="toggleShowtimeModal(showtime._id, true)"
                      >{{ formatShowtimeBubbleTime(showtime.time) }}</span>
                      <ShowtimeModal
                        :active="modalState[showtime._id]"
                        :styleInfo="showtimeModalCss(showtime, hallIndex)"
                        :hall="halls[showtime.hall]"
                        :showtime="showtime"
                        :hallCells="hallCells"
                        @hide-modal="onHideModal"
                      />
                    </div>
                  </div>
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
import { Component, Prop, Vue, Inject, Watch, Emit, } from "vue-property-decorator";
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { MainModule } from "../../store/modules/main";
import { Debounce } from 'vue-debounce-decorator';
import TimetableHeader from "./TimetableHeader.vue";
import Calendar from "./Calendar.vue";
import ShowtimeModal from "./ShowtimeModal.vue";
import { ModelMap } from "../../types";
import { Genre, Showtime, Hall, HallCell, AgeRule, Cinema, Film } from '../../store/models';
import { formatPrice } from '../../shared/utils';
import moment from 'moment';
import { HOURS_MERGED } from '../../shared/constants';
import { Bus } from '../../shared/bus';

@Component({
  components: {
    TimetableHeader,
    Calendar,
    ShowtimeModal
  }
})
export default class Timetable extends Vue {
  date: string = '';
  modalState: { [showtime: string]: boolean } = {};
  bubbleWidth = 50;

  created() {
    Bus.$on('hide-modal', this.onHideModal);
  }

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

  onHideModal(showtime: string) {
    this.toggleShowtimeModal(showtime, false);
  }
  toggleShowtimeModal(showtime: string, status: boolean) {
    if (status) {
      // toggle on, disable others
      for (const showtime in this.modalState) {
        this.modalState[showtime] = false;
      }
    }
    this.$set(this, 'modalState', {
      ...this.modalState,
      [showtime]: status,
    });
    // this.$set(this.modalState, showtime, status);
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
  showtimeBubbleCss(showtime: any, hallIndex: number) {
    // todo: color
    const color = this.hallColors[Math.min(hallIndex, this.hallColors.length - 1)];
    const time = moment(showtime.time);
    const maxHour = this.endHour + 1;

    const hourish = moment.duration(time.hours() * 60 + time.minutes(), 'minutes').asHours();
    // console.log(hourish, this.hourWidth);
    const offset = hourish / maxHour * 100; // %
    // const offset = hourish * hourWidth / HOURS_MERGED;
    return {
      'background-color': color,
      'left': `${offset}%`,
      'width': this.bubbleWidth,
    }
  }
  showtimeModalCss(showtime: Showtime, hallIndex: number) {
    const time = moment(showtime.time);
    const maxHour = this.endHour + 1;

    const hourish = moment.duration(time.hours() * 60 + time.minutes(), 'minutes').asHours();
    // console.log(hourish, this.hourWidth);
    const offset = hourish / maxHour * 100; // %
    // const offset = hourish * hourWidth / HOURS_MERGED;
    return {
      color: this.hallColors[Math.min(hallIndex, this.hallColors.length - 1)],
      offset,
      bwhf: this.bubbleWidth / 2,
    }
  }

  get hallColors(): string[] {
    return [
      '#00d1b2',
      '#ffcb77',
      '#557C9D',
      '#fe6d73',
      '#F6C0D0',
    ];
  }

  get hourWidth() {
    return window.$('.hour').eq(0).outerWidth();
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
.timetable-entry {
  $border-color: #8d8d8d;
  border-bottom: 1px solid $border-color;
  margin-bottom: 1rem;
  .left {
    border-right: 1px solid $border-color;
  }
  .right {

  }
}
.timetable-row {

}
.timetable-entry {
  background-color: #fafafa;
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
      font-size: 0.85rem;
      cursor: pointer;
      position: absolute;
    }
  }
}
</style>