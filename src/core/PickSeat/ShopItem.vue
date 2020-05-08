<template>
  <div class="column is-4-desktop is-12-mobile">
    <div class="card shop-item">
      <header class="card-header">
        <p class="card-header-title is-centered">
          {{shopItem.name}}
        </p>
      </header>
      <div class="card-image">
        <div
          class="image is-4by5 item-image"
          :style="itemStyle"
        ></div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item is-static"
        >{{itemPrice}}</a>
        <a class="card-footer-item"
          style="user-select: none"
          @click="onBuy"
        >Купить</a>
      </footer>
    </div>

  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
moment.locale('ru');
import { ShopItem as ShopItemModel } from '../../store/models';
import { formatPrice } from '../../shared/utils';

@Component
export default class ShopItem extends Vue {
  name = 'ShopItem';
  @Prop() shopItem!: ShopItemModel;

  get itemPrice() {
    return formatPrice(this.shopItem.price, true);
  }
  get itemStyle() {
    return {
      'background-image': `url('${this.shopItem.image}')`,
    };
  }

  @Emit('buy-item')
  onBuy() {
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
  color: #363636!important;
}
</style>