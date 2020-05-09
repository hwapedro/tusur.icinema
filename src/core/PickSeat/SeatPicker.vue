<template>
  <div
    class="seat-picker"
    v-if="showtime && hall"
  >
    <div class="container has-text-centered">
      <div class="hall-row">
        <div class="hall-cell numeric hidden"></div>
        <div
          class="hall-cell numeric"
          v-for="i in cellState[0].length"
          :key="i"
        >
          {{i}}</div>
      </div>
      <div
        class="hall-row"
        v-for="(row, rowIndex) in cellState"
        :data-hehe="rowIndex"
        :key="rowIndex"
      >
        <span class="hall-cell numeric">{{rowIndex + 1}}</span>
        <div
          class="hall-cell"
          v-for="(cell, cellIndex) in row"
          :data-hehe="`${rowIndex}_${cellIndex}`"
          :key="`${rowIndex}_${cellIndex}`"
          :style="{
            'background-color': cellColor(rowIndex, cellIndex, hall.structure[rowIndex][cellIndex]),           
            'cursor': cell > 1 ? 'pointer' : 'initial',
            }"
          @click="onCellClick(rowIndex, cellIndex)"
        ></div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit, Watch } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
import { Showtime, Hall, HallCell } from "../../store/models";
import { ModelMap } from "../../types";
import { COLOR_TAKEN, COLOR_SELECTED, CELL_STATE, COLOR_FORBIDDEN } from '../../shared/constants';
import { Bus } from "../../shared/bus";

@Component
export default class SeatPicker extends Vue {
  name = 'SeatPicker';
  @Prop() showtime: Showtime;
  @Prop() hall: Hall;
  @Prop() hallCells: ModelMap<HallCell>;
  @Prop() disabled: boolean;

  cellState: CELL_STATE[][] = null;

  created() {
    Bus.$on('deselect-sp', (place) => {
      this.deselect(place);
    })
  }

  @Watch('hall', { deep: true, immediate: true })
  onHallChange(hall: Hall) {
    this.calculateCellState(hall, this.showtime);
  }

  @Watch('showtime', { deep: true, immediate: true })
  onShowtimeChange(showtime: Showtime) {
    this.calculateCellState(this.hall, showtime);
  }

  calculateCellState(hall: Hall, showtime: Showtime) {
    if (!hall || !showtime)
      return;
    const structure = hall.structure;
    this.cellState = [];
    for (let i = 0; i < structure.length; ++i) {
      this.cellState[i] = Array(structure[0].length);
      for (let j = 0; j < structure[0].length; ++j) {
        this.cellState[i][j] = CELL_STATE.FREE;
        if (structure[i][j] === 0) {
          // we CANNOT select this cell
          this.cellState[i][j] = CELL_STATE.FORBIDDEN;
        }
      }
    }
    if (showtime.taken) {
      for (const taken of showtime.taken) {
        this.cellState[taken.row][taken.cell] = CELL_STATE.TAKEN;
      }
    }
  }

  deselect({ row, cell }) {
    const state = this.cellState[row][cell];
    const newRow = this.cellState[row].slice();
    newRow[cell] = CELL_STATE.FREE;
    this.$set(this.cellState, row, newRow);
  }
  onCellClick(row: number, cell: number) {
    if (this.disabled) {
      return;
    }
    // depending on type
    const state = this.cellState[row][cell];

    const newRow = this.cellState[row].slice();

    if (state === CELL_STATE.FREE) {
      newRow[cell] = CELL_STATE.SELECTED;
      Bus.$emit('select-seat', {
        row,
        cell
      });
    } else if (state === CELL_STATE.SELECTED) {
      newRow[cell] = CELL_STATE.FREE;
      Bus.$emit('deselect-seat', {
        row,
        cell
      });
    }

    this.$set(this.cellState, row, newRow);
  }

  cellColor(row: number, cell: number, cellIndex: number): string {
    if (!this.cellState
      || !this.cellState[row]) {
      return 'none'; //''#ffffff00';
    }
    switch (this.cellState[row][cell]) {
      case CELL_STATE.FREE:
        return this.hallCells[cellIndex] ? this.hallCells[cellIndex].color : '#fac';
        break;
      case CELL_STATE.SELECTED:
        return COLOR_SELECTED;
        break;
      case CELL_STATE.FORBIDDEN:
        return COLOR_FORBIDDEN;
        break;
      case CELL_STATE.TAKEN:
        return COLOR_TAKEN;
        break;
    }
    // check if taken
    if (this.showtime.taken.find(seat => seat.row === row && seat.cell === cell)) {
      return COLOR_TAKEN;
    }
  }
}
</script>

<style lang="scss" scoped>
.seat-picker {
  $space: 0.6rem;
  .hall-row {
    margin-bottom: $space;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  $base-size: 1.8rem;
  .hall-cell {
    margin-right: $space;
    width: $base-size;
    height: $base-size * 1.4;
    border-radius: 5px;
    display: inline-block;

    &.numeric {
      vertical-align: middle;
      text-align: center;
      color: #000;
      font-weight: bold;
      font-size: 1.5rem;
    }
  }
}
</style>