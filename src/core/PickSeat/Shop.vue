<template>
  <Loader :loading="loading">
    <div class="tabs is-medium is-boxed">
      <ul>
        <li
          v-for="(shopEntry, shopId) in shops"
          :key="shopId"
          :class="{
            'is-active': shop === shopId
            }"
          @click="selectShop(shopId)"
        >
          <a>
            <span>{{shopEntry.name}}</span>
          </a>
        </li>
      </ul>
    </div>

    <div v-if="selectedShop">
      <Loader :loading="itemsLoading">
        <div class="title is-3">{{selectedShop.name}}</div>
        <div class="columns">
          <ShopItem
            v-for="(shopItem, shopItemId) in shopItemsPaginated"
            :shopItem="shopItem"
            :key="shopItemId"
            @buy-item="buyItem"
          />
        </div>
        <hr>
        <!-- paginator -->
        <Paginator
          :take="take"
          :page="page"
          :hasMore="hasMore"
          :total="total"
          @page-next="onPageNext"
          @page-prev="onPagePrev"
        />
      </Loader>
    </div>
  </Loader>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit, Watch } from 'vue-property-decorator';
import moment from 'moment';
import { uppercaseFirst } from '../../shared/utils';
import { MainModule } from '../../store/modules/main';
import Loader from '../../shared/components/Loader.vue';
import ShopItem from './ShopItem.vue';
moment.locale('ru');
import { Shop as ShopModel } from '../../store/models';
import Paginator from '../../shared/components/Paginator.vue';
import { ModelMap, Pagination } from "../../types";
import { Bus } from '../../shared/bus';
import api from '../../api';
import { stateMerge } from 'vue-object-merge';

@Component({
  components: {
    Loader,
    ShopItem,
    Paginator
  }
})
export default class Shop extends Vue {
  name = 'Shop';
  shop: string = '';
  skip: number = 0;
  take: number = process.env.NODE_ENV === 'development' ? 3 : 15;
  total: number = 0;
  hasMore: boolean = false;

  itemsLoading: boolean = false;
  shopItemsPaginated: any = {};

  mounted() {
    this.fetchShops();
  }

  async fetchShops() {
    MainModule.fetchShops();
  }

  async fetchItems() {
    if (!this.shop) {
      return;
    }
    try {
      this.itemsLoading = true;
      this.shopItemsPaginated = {};
      const { data } = await api.get(`shops/${this.shop}/items`, {
        skip: this.skip,
        limit: this.take,
      });
      if (data.success) {
        const newData = {};
        for (const index in data.items) {
          const entry = data.items[index];
          newData[entry._id] = entry;
        }
        stateMerge(this.shopItemsPaginated, newData);
        this.total = data.total;
        this.hasMore = data.hasMore;
      }
    } finally {
      this.itemsLoading = false;
    }
  }
  onPageNext() {
    this.skip = this.skip + this.take;
    this.fetchItems();
  }
  onPagePrev() {
    this.skip = Math.max(0, this.skip - this.take);
    this.fetchItems();
  }
  get page() {
    return Math.floor(this.skip / this.take);
  }
  get paginator(): Pagination {
    return MainModule.shopItemsPagination;
  }

  buyItem(item) {
    Bus.$emit('buy-item', item);
  }

  @Watch('shops')
  onNewShops() {
    if (!this.shop) {
      this.selectShop(Object.values(this.shops)[0]._id);
    }
  }

  @Watch('shop')
  onShopChange() {
    this.skip = 0;
    this.fetchItems();
  }

  @Watch('cinema')
  onCinemaChange() {
    this.fetchShops();
  }

  selectShop(shopId) {
    this.shop = shopId;
  }

  get cinema() {
    return MainModule.cinema;
  }
  get shops(): Record<string, ShopModel> {
    return MainModule.shops;
  }

  get selectedShop() {
    return this.shops[this.shop];
  }
  get loading() {
    return MainModule.loading;
  }
}
</script>

<style lang="scss" scoped>
.shop {
}
</style>