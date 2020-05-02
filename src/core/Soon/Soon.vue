<template>
  <div class="soon">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title">Афиша</h1>
          <div class="tabs is-fullwidth is-medium is-toggle">
            <ul>
              <li
                v-for="(month) in sortedMonths"
                :key="month"
                :class="{
                'is-active': soonMonth === month
                }"
              ><a @click="setSonMonth(month)">
                  <span class="has-text-centered">Фильмы<br>{{monthToString(month)}}</span>
                </a></li>
            </ul>
          </div>
          <div
            class="columns"
            v-if="soonMonth && soonFilms[soonMonth]"
          >
            <div class="column">
              <SoonFilm
                v-for="film in soonFilms[soonMonth]"
                :key="film._id"
                :film="film"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import SoonFilm from './SoonFilm.vue';
import { MainModule } from '../../store/modules/main';
import { Debounce } from 'vue-debounce-decorator';
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';

const MONTH_VALUES = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

@Component({
  components: {
    SoonFilm
  }
})
export default class Soon extends Vue {
  name = 'Soon';

  mounted() {
    this.fetchSoon();
  }

  @Watch('cinema')
  onCinemaChange() {
    this.fetchSoon();
  }

  @Watch('soonFilms')
  onSoonChange() {
    this.setSonMonth(this.sortedMonths[0]);
  }

  @Debounce({ time: 500 })
  async fetchSoon() {
    await MainModule.fetchSoon();
  }

  monthToString(month: string) {
    return (MONTH_VALUES[moment(month, 'YYYY-MM').month()]);
  }
  get cinema() {
    return MainModule.cinema;
  }
  get sortedMonths() {
    return Object.keys(this.soonFilms).sort((a, b) => Math.sign(moment(a).diff(moment(b))));
  }
  get soonFilms() {
    return MainModule.soonFilms;
  }
  get soonMonth() {
    return MainModule.soonMonth;
  }
  setSonMonth(month: string) {
    MainModule.setSoonMonth(month);
  }
}

</script>