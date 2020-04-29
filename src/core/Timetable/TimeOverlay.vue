<template>
  <div class="schedule-overlay">
    <div
      class="cover"
      v-if="active"
      :style="{
        width: animateActive ? `${coverWidth}%` : 0, 
      }"
    >
    </div>
    <ul class="lines">
      <li
        class="lines__block"
        v-for="hour in hourRange"
        :style="{
          'width': `${hourWidth}px`
          }"
        :key="hour"
      >&nbsp;s</li>
    </ul>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
moment.locale('ru');
import { HOURS_MERGED } from '../../shared/constants';

@Component
export default class TimeOverlay extends Vue {
  name = 'TimeOverlay';
  @Prop() startHour!: number;
  @Prop() endHour!: number;
  @Prop() hourWidth!: number;
  @Prop() date: string;
  active: boolean = false;
  animateActive: boolean = false;

  mounted() {
    // check time 
    if (this.date === moment().format('YYYY-MM-DD')) {
      this.active = true;
      setTimeout(() => this.animateActive = true, 140);
    }
  }

  get coverWidth(): number {
    const now = moment();
    return moment.duration(now.hours() * 60 + now.minutes(), 'minutes').asHours() / (this.endHour + 1) * 100;
  }

  get hourRange() {
    return Array(this.endHour - this.startHour).fill(0)
      .map((_, i) => `0${(this.startHour + i)}`.slice(-2))
      .filter((__, i) => i % HOURS_MERGED === 0);
  }
}
</script>

<style lang="scss" scoped>
.schedule-overlay {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  left: 0;
  top: 0;

  .cover {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    border-right: 2px solid #4643c3;
    height: 100%;
    z-index: 50000;
    width: 0;
    transition: width 1s cubic-bezier(0.53, 1.56, 0.68, 0.92);
  }

  .lines {
    height: 100%;
    border-bottom: 1px solid rgba(49, 39, 43, 0.678);
    // margin-right: 0.5rem;

    &__block {
      height: 100%;
      padding: 20px 0;
      float: left;
      border-right: 1px solid #201e3a88;
      background: #eef3fcd3;
      margin: 0;
      text-indent: -9999px;
      text-align: left;
      white-space: normal;
    }
  }
}
</style>