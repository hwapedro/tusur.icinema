<template>
  <div class="timetable-header">
    <div class="columns">
      <div class="column is-offset-4 timetable-header__row">
        <div class="level">
          <div
            class="hour"
            v-for="hour in hourRange"
            :key="hour"
            :style="{
            }"
          >{{hour}}<sup>00</sup></div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";
import { HOURS_MERGED } from '../../shared/constants';

@Component
export default class TimetableHeader extends Vue {
  @Prop() startHour!: number;
  @Prop() endHour!: number;
  @Prop() itemWidth!: number;

  mounted() {

  }

  get hourRange() {
    return Array(this.endHour - this.startHour).fill(0)
      .map((_, i) => `0${(this.startHour + i)}`.slice(-2))
      .filter((__, i) => i % HOURS_MERGED === 0);
  }
}
</script>

<style lang="scss" scoped>
.timetable-header {
  &__row {
    padding-left: 0;
    padding-right: 0;
  }
}
.hour {
  flex: 1;
  text-align: left;
}
</style>