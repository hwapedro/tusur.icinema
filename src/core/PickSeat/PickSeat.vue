<template>
  <Loader :loading="!showtime || !showtime.hall || !halls[showtime.hall]">
    <div class="container">
      <div
        class="columns"
        v-if="paymentErrorType"
      >
        <div class="column">
          <!-- alert -->
          <div class="notification payment-error is-danger content">
            <button
              class="delete"
              @click="hideError"
            ></button>{{paymentErrorText}}
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-9">
          <h1 class="title">Выберите места</h1>
          <SeatList :hallCells="hallCells" />
          <SeatPicker
            :disabled="isPaying"
            :showtime="showtime"
            :hall="halls[showtime ? showtime.hall : '__hehe_xd']"
            :hallCells="hallCells"
          />
        </div>
        <div class="column is-3">
          <div class="title is-3">Ваши места:</div>
          <div>
            <div
              class="buttons is-fullwidth has-addons"
              style="margin-bottom: .2rem;"
              v-for="(place, placeIndex) in selectedPlaces"
              :key="`${place.row}-${place.cell}`"
            >
              <div
                class="button is-static"
                style='color: #000;'
                :style="{
                  'background-color': hallCells[halls[showtime.hall].structure[place.row][place.cell]].color 
                  }"
              >
                <span v-if="!badSeats.find(s => s.row === place.row && s.cell === place.cell)">{{placeIndex + 1}}</span>
                <span
                  v-else
                  class="icon  has-text-danger"
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
                :style="{
                  'background-color': hallCells[halls[showtime.hall].structure[place.row][place.cell]].color 
                  }"
              >Ряд {{place.row + 1}}, место {{place.cell + 1}}</button>
              <button
                class="button  is-danger"
                :disabled="isPaying"
                @click="removeSelect(place)"
              >&#10006;</button>
            </div>
          </div>
          <div class="title is-3">Ваши товары:</div>
          <div>
            <BoughtItem
              v-for="(selectedItem, itemId) in selectedItems"
              :key="itemId"
              :shopItem="selectedItem"
              :count="selectedItem.count"
              :isBad="itemIsBad(itemId)"
              :isPaying="isPaying"
              @unbuy-item="onItemUnbuy"
            />
          </div>
          <div class="title is-3">Итого: {{totalSum}} руб.</div>
          <hr>
          <div class="form-control">
            <Label>Имя</Label>
            <Input
              type="text"
              @blur="$v.firstName.$touch()"
              v-model="firstName"
            />
            <FormErrors
              :validation="$v.firstName"
              :errorTexts="{
              required: 'Введите имя',
            }"
            />
          </div>
          <div class="form-control">
            <Label>Фамилия</Label>
            <Input
              type="text"
              @blur="$v.lastName.$touch()"
              v-model="lastName"
            />
            <FormErrors
              :validation="$v.lastName"
              :errorTexts="{
              required: 'Введите фамилию',
            }"
            />
          </div>
          <div class="form-control">
            <Label>Телефон</Label>
            <Input
              type="text"
              @blur="$v.phone.$touch()"
              v-model="phone"
            />
            <FormErrors
              :validation="$v.phone"
              :errorTexts="{
              required: 'Введите телефон в формате +7ХХХХХХХХХХХ',
              length: 'Странный телефон',
              format: 'Введите телефон в формате +7ХХХХХХХХХХХ',  
            }"
            />
          </div>
          <button
            class="button is-primary is-fullwidth"
            style="margin-top: 1rem;"
            :disabled="$v.$anyError || !selectedPlaces.length"
            v-if="!isPaying"
            @click="prepareForPayment"
          >Перейти к оплате</button>
          <hr v-if="isPaying">
          <div id="paypal-button"></div>
        </div>
      </div>
      <hr>
      <div class="columns">
        <div class="column">
          <Shop @add-item="onShopItemAdd" />
        </div>
      </div>
    </div>
  </Loader>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { MainModule } from '../../store/modules/main';
import api from '../../api';
import { Validate, Validations } from 'vuelidate-property-decorators';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Input from '../../shared/components/Input.vue';
import Label from '../../shared/components/Label.vue';
import Loader from '../../shared/components/Loader.vue';
import FormErrors from '../../shared/components/FormErrors.vue';
import { ModelMap } from "../../types";
import { Genre, Showtime, Hall, HallCell, AgeRule, Cinema, Film } from '../../store/models';
import { formatPrice } from '../../shared/utils';
import moment from 'moment';
import { HOURS_MERGED } from '../../shared/constants';
import { Bus } from '../../shared/bus';
import SeatPicker from './SeatPicker.vue';
import SeatList from './SeatList.vue';
import BoughtItem from './BoughtItem.vue';
import Shop from './Shop.vue';
import AlertIcon from 'vue-ionicons/dist/js/md-alert'
import { ShopItem as ShopItemModel } from '../../store/models';
import { stateMerge } from 'vue-object-merge';
import jsPDF from 'jspdf';

@Component({
  components: {
    Input,
    Label,
    FormErrors,
    AlertIcon,
    Loader,
    SeatPicker,
    Shop,
    BoughtItem,
    SeatList
  }
})
export default class PickSeat extends Vue {
  @Prop() showtimeId!: string;

  name = 'PickSeat';
  // form
  firstName = '';
  lastName = '';
  phone = '';

  badSeats: any[] = [];
  badItems: any[] = [];
  paymentErrorType = null;
  ticket: any = null;

  @Watch('phone')
  wph() {
    console.log(this.phone);
  }

  @Validations()
  validations = {
    firstName: { required },
    lastName: { required },
    phone: {
      required,
      format(val) {
        return /^((\+7)|(8))\d{10}$/.test(val);
      }
    }
  }

  isPaying: boolean = false;
  payUntil: Date = new Date();
  blockId: string = '';

  selectedPlaces: { row: number, cell: number }[] = [];
  selectedItems: Record<string, ShopItemModel & { count: number }> = {};

  created() {
    if (!this.showtimes[this.showtimeId])
      MainModule.getShowtime(this.showtimeId);

    Bus.$on('select-seat', this.onSeatSelect);
    Bus.$on('deselect-seat', this.onSeatDeselect);
    Bus.$on('buy-item', this.onItemBuy);
  }
  destroyed() {
    Bus.$off('select-seat');
    Bus.$off('deselect-seat');
    Bus.$off('buy-item');
  }

  onShopItemAdd({ item }) {

  }
  onSeatSelect({ row, cell }) {
    if (this.isPaying)
      return;
    this.selectedPlaces.push({
      row,
      cell,
    });
  }
  onSeatDeselect({ row, cell }) {
    if (this.isPaying)
      return;
    const pos = this.selectedPlaces.findIndex(seat => seat.row === row && seat.cell === cell);
    if (pos > -1) {
      this.selectedPlaces.splice(pos, 1);
    }
  }
  removeSelect(seat) {
    if (this.isPaying)
      return;
    this.onSeatDeselect(seat);
    Bus.$emit('deselect-sp', seat);
  }
  hideError() {
    this.paymentErrorType = null;
  }

  onItemBuy(item) {
    if (this.isPaying) return;
    const data = this.selectedItems[item._id] || {
      count: 0,
      ...item,
    };
    data.count++;
    const newobj = {
      [item._id]: data,
    };
    stateMerge(this.selectedItems, newobj);
  }
  onItemUnbuy(item) {
    if (this.isPaying) return;
    if (typeof this.selectedItems[item._id] !== 'undefined') {
      this.selectedItems[item._id].count--;
      if (this.selectedItems[item._id].count <= 0) {
        delete this.selectedItems[item._id];
      }
    }
  }
  itemIsBad(itemId) {
    return this.badItems.find(item => item._id === itemId);
  }

  get showtime() {
    return this.showtimes[this.showtimeId];
  }
  get films(): ModelMap<Film> {
    return MainModule.films;
  }
  get showtimes() {
    return MainModule.showtimes;
  }
  get halls(): ModelMap<Hall> {
    return MainModule.halls;
  }
  get hallCells(): ModelMap<HallCell> {
    return MainModule.hallCells;
  }
  get genres(): ModelMap<Genre> {
    return MainModule.genres;
  }
  get ageRules(): ModelMap<AgeRule> {
    return MainModule.ageRules;
  }
  get cinema(): string {
    return MainModule.cinema;
  }
  get shopItems() {
    return MainModule.shopItems;
  }
  get paymentErrorText() {
    switch (this.paymentErrorType) {
      case 'taken':
        return `Данные места уже заняты:\n${this.badSeats.map(seat => `Ряд ${seat.row + 1}, место ${seat.cell + 1}`).join('\n')}.\nПожалуйста, выберите другие места.`;
        break;
      case 'out-of-stock':
        return `Данных товаров нет в наличии:\n${this.badItems.map(item => `${item.name}`).join(',\n')}`;
        break;
    }
  }
  get selectedItemsPrep() {
    return Object.values(this.selectedItems).map(item => ({
      item: item._id,
      quantity: item.count,
    }));
  }

  get totalSum() {
    const hall = MainModule.halls[this.showtime ? this.showtime.hall : 'null'];
    if (!hall) {
      return '-';
    }
    const sumCells = this.selectedPlaces.reduce((acc, curr) => {
      const cell = MainModule.hallCells[hall.structure[curr.row][curr.cell]];
      return acc + (cell ? cell.price : 0);
    }, 0);
    const sumItems = Object.values(this.selectedItems).reduce((acc, curr) => acc + curr.price * curr.count, 0);
    return formatPrice(sumCells + sumItems, false);
  }

  ticketText() {
    if (this.ticket) {
      const {
        _id: ticketId,
        firstName,
        lastName,
        phone,
        transactionId,
        orderedItems,
        seats,
        price,
        dbItems,
        cinema,
        film,
        hall,
        time
      } = this.ticket;
      const formatPlace = (seat) => {
        return `Ряд ${seat.row + 1}, место ${seat.cell + 1}`;
      }
      const formatItem = (item) => {
        const dbItem = dbItems.find(dbi => dbi._id === item.item);
        return `${dbItem ? dbItem.name : ''}: ${formatPrice(dbItem.price, true)} x ${item.quantity} шт = ${formatPrice(item.price * item.quantity, true)}`;
      }

      return `
--------------------------------------------------------
Кинотеатр ${cinema.name}, ${cinema.address}.
Билеты на фильм ${film.name}, сеанс ${moment(time).format('DD MMM YYYY, HH:mm:ss')}.
Покупатель: ${firstName} ${lastName}
Телефон: ${phone}
---- Места ----
${seats.map(formatPlace).join('\n')}
---- Товары ----
${orderedItems.map(formatItem).join('\n')}
--------------------------------------------------------
Итого:  ${formatPrice(price, true)}
--------------------------------------------------------
ID заказа: ${ticketId}
`.replace(/\n/g, '\r\n');
    }
    return '';
  }

  async prepareForPayment() {
    this.paymentErrorType = null;
    this.badSeats = [];
    this.badItems = [];
    await (this as any).$v.$touch();
    if ((this as any).$v.$anyError) {
      return false;
    }
    const { data } = await api.post('payment/start', {
      seats: this.selectedPlaces,
      items: this.selectedItemsPrep,
      showtimeId: this.showtimeId
    });
    if (data.success) {
      this.payUntil = new Date(Date.now() + data.blockDuration);
      this.blockId = data.blockId;
      this.isPaying = true;
      this.renderPaymentButton();
    } else {
      if (data.status === 'taken') {
        this.paymentErrorType = 'taken';
        this.badSeats = data.seats;
      } else if (data.status === 'out-of-stock') {
        this.paymentErrorType = 'out-of-stock';
        this.badItems = data.items;
      }
    }
  }

  waitForPaypal() {
    return new Promise(res => {
      const interval = setInterval(() => {
        if (window.paypal) {
          clearInterval();
          return res();
        }
      }, 20);
    });
  }

  async generatePDF(ticket: any) {
    const downloadFile = (data: any, mime: string, filename: string) => {
      const blob = new Blob([data], { type: mime });
      if ('msSaveOrOpenBlob' in navigator) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const elem = document.createElement('a');
        elem.href = URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    }

    this.ticket = ticket;
    const text = this.ticketText();
    console.log(text);
    downloadFile(text, 'plain/text', `${ticket.firstName}_${ticket.lastName}_${(new Date).toISOString()}.txt`);
  }

  async renderPaymentButton() {
    await this.waitForPaypal();
    const ppb = document.querySelector('#paypal-button > *');
    if (ppb)
      ppb.remove()
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'RUB',
              value: this.totalSum,
            }
          }]
        });
      },
      onApprove: async (data, actions) => {
        console.log(data);
        const { data: captureResult } = await api.post('payment/submit', {
          showtimeId: this.showtimeId,
          blockId: this.blockId,
          firstName: this.firstName,
          lastName: this.lastName,
          orderedItems: this.selectedItemsPrep,
          phone: this.phone,
          cinemaId: this.cinema,
          orderId: data.orderID,
        });
        console.log(captureResult);
        if (captureResult.success) {
          // print ticket
          await this.generatePDF(captureResult.ticket);
          setTimeout(() => {
            this.$router.push('/thank-you');
          }, 1000);
        }
      }
    }).render('#paypal-button');
  }
}

</script>

<style lang="scss" scoped>
.payment-error {
  white-space: pre-wrap;
}
</style>