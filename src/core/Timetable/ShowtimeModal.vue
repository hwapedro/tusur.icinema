<template>
  <transition name="fade">
    <div
      class="showtime-modal box is-paddingless"
      v-show="active"
      :data-id="showtime._id"
      @mouseleave="onMouseLeave"
    >
      <component :is="'style'">
        .showtime-modal[data-id="{{showtime._id}}"] {
        transform: translate(calc(-50% + {{ styleInfo.bwhf }}px));
        left: {{ styleInfo.offset }}%;
        }
        .showtime-modal[data-id="{{showtime._id}}"] .showtime-modal__body {
        background-color: {{ shadeColor(styleInfo.color, percent) }};
        border-color: {{ styleInfo.color }};
        }
        .showtime-modal[data-id="{{showtime._id}}"] hr {
        background-color: {{ shadeColor(styleInfo.color, -percent) }};
        }
      </component>
      <div class="message">
        <div
          class="showtime-modal__header"
          :style="{
            'background-color': styleInfo.color,
          }"
        >{{ hall.name }}</div>
        <div class="showtime-modal__body">
          <div class="prices">Цена: {{ showtimePrices }}</div>
          <router-link
            :to="`/showtime/${showtime._id}`"
            v-slot="{ href, route, navigate}"
          >
            <a
              class="link button is-link is-outlined is-focused is-primary"
              @click="navigate"
              :href="href"
            >К выбору мест</a>
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import { Showtime, Hall, HallCell } from "../../store/models";
import { shadeColor, getHallCells, formatPrice } from '../../shared/utils';
import { ModelMap } from "../../types";

@Component
export default class ShowtimeModal extends Vue {
  name = 'ShowtimeModal';
  @Prop() showtime!: Showtime;
  @Prop() hall: Hall;
  @Prop() hallCells: ModelMap<HallCell>;
  @Prop() active!: boolean;
  @Prop() styleInfo!: any;
  percent = 13;

  shadeColor: Function = () => { };

  created() {
    this.shadeColor = shadeColor;
  }

  @Emit('hide-modal')
  onMouseLeave() {
    return this.showtime._id;
  }

  get showtimePrices() {
    const unqiueHallCells = getHallCells(this.hall);
    const prices = [];
    unqiueHallCells.forEach(index => {
      const hallCell = this.hallCells[index];
      if (hallCell) {
        prices.push(hallCell.price);
      }
    });
    return prices.length 
      ? prices.map(price => formatPrice(price, false)).join(' / ') + ' руб.'
      : '?';
  }
}
</script>

<style lang="scss" scoped>
.showtime-modal {
  position: absolute;
  bottom: calc(-10%);
  width: 250px;
  z-index: 10000;
  text-align: center;

  &__header {
    border-radius: 4px 4px 0 0;
    font-weight: 700;
    line-height: 1.25;
    font-size: 1.1rem;
    padding: 0.75em 1em;
    position: relative;
  }
  &__body {
    border-color: #dbdbdb;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-style: solid;
    border-width: 0;
    color: #4a4a4a;
    padding: 1.25em 0;
    $break: .7rem;
    .hall-preview {
      margin-bottom: $break;
    }
    .prices {
      margin-bottom: $break;
    }
    .link {
      // color: #ffaacc!impoant;
      font-size: .91rem;
    }
  }
  hr {
    margin: 0.3rem 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>