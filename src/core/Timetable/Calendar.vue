<template>
  <div class="calendar">
    <div class="buttons has-addons">
      <button
        class="button"
        :class="{
        'is-selected': selectedDate === dateInfo.iso,
        'is-info': selectedDate === dateInfo.iso,
        'is-link': dateInfo.showtimesExist && selectedDate !== dateInfo.iso,
        'is-light': selectedDate !== dateInfo.iso,
      }"
        v-for="dateInfo in datesList"
        :key="dateInfo.iso"
        :disabled="!dateInfo.showtimesExist"
        @click="onDateClick(dateInfo.iso)"
      >
        {{ dateInfo.iso }}
        <br>
        {{ dateInfo.word }}
      </button>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
moment.locale('ru');

@Component
export default class Calendar extends Vue {
  name = 'Calendar';
  @Prop() dates!: string[];
  @Prop() selectedDate: string;

  @Emit('set-date')
  onDateClick(date: string) {
    return date;
  }

  get datesList() {
    const list = [];
    const sortedDates = this.dates.sort((a, b) => moment(a).unix() - moment(b).unix());
    for (let m = moment(sortedDates[0]), step = 0; step < 7; ++step, m.add(1, 'day')) {
      const iso = m.format('YYYY-MM-DD');
      list.push({
        iso,
        showtimesExist: this.dates.includes(iso),
        date: m.format('DD.MM'),
        word: step === 0 ? 'Сегодня' : step === 1 ? 'Завтра' : uppercaseFirst(m.format('dddd')),
      });
    }
    return list;
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  margin-bottom: 1rem;
  .button {
    height: initial!important;
  }
}
</style>