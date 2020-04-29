<template>
  <div class="schedule-overlay">
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