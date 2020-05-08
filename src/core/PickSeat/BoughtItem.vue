<template>
  <div
    class="buttons is-fullwidth has-addons"
    style="margin-bottom: .2rem;"
  >
    <div
      class="button is-static"
      style='color: #000;'
    >
      <span v-if="!isBad">{{count}}</span>
      <span
        v-else
        class="icon has-text-danger"
      >
        <AlertIcon
          w="32px"
          h="32px"
        />
      </span>
    </div>
    <button
      class="button is-static is-expanded"
      style='color: #000;'
    >{{shopItem.name}}</button>
    <button
      class="button is-danger"
      :disabled="isPaying"
      @click="onUnbuy"
    >&#10006;</button>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
moment.locale('ru');
import { ShopItem as ShopItemModel } from '../../store/models';
import { formatPrice } from '../../shared/utils';
import AlertIcon from 'vue-ionicons/dist/js/md-alert'

@Component({
  components: {
    AlertIcon
  }
})
export default class BoughtItem extends Vue {
  name = 'BoughtItem';
  @Prop() shopItem!: ShopItemModel;
  @Prop() count!: number;
  @Prop() isBad!: boolean;
  @Prop() isPaying!: boolean;

  get itemPrice() {
    return formatPrice(this.shopItem.price, true);
  }
  get itemStyle() {
    return {
      'background-image': `url('${this.shopItem.image}')`,
    };
  }

  @Emit('unbuy-item')
  onUnbuy() {
    return this.shopItem;
  }
}
</script>

<style lang="scss" scoped>
.shop-item {
}
.item-image {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  // height: 500px;
}
.is-static {
  color: #363636 !important;
}
</style>