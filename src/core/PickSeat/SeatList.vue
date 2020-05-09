<template>
  <div
    class="field is-grouped is-grouped-multiline"
    v-if="hallCells"
  >
    <div
      class="control price-tag"
      v-for="(hallCell) in hallCells"
      :key="hallCell._id"
    >
      <div class="tags has-addons">
        <span
          class="tag cell-name is-medium"
          :style="{
            'background-color': hallCell.color
          }"
        >{{hallCell.name}}</span>
        <span
          class="tag cell-price is-medium"
          :style="{
            'background-color': hallCell.color
          }"
        >{{cellprice(hallCell)}}</span>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
moment.locale('ru');
import { ShopItem as ShopItemModel, HallCell } from '../../store/models';
import { formatPrice } from '../../shared/utils';

@Component
export default class SeatList extends Vue {
  name = 'SeatList';
  @Prop() hallCells: Record<string, HallCell>;

  cellprice(cell: HallCell) {
    return formatPrice(cell.price, true);
  }
}
</script>

<style lang="scss" scoped>
.price-tag {
  // font-weight: bold;
}
.cell-name {
  font-weight: bold;
}
</style>