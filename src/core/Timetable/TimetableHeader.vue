<template>
  <div class="timetable-header">
    <div class="columns">
      <div class="column is-offset-4">
        <div class="level">
          <div class="level-item"
            v-for="hour in hourRange"
            :key="hour"
          >{{hour}}<sup>00</sup></div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";

@Component
export default class TimetableHeader extends Vue {
  @Prop() startHour!: number;
  @Prop() endHour!: number;

  mounted() {

  }

  get hourRange() {
    return Array(this.endHour - this.startHour).fill(0).map((_, i) => `0${(this.startHour + i)}`.slice(-2));
  }
}
</script>

<style lang="scss" scoped>
  sup {
  }
</style>