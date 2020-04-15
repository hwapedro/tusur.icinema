<template>
  <div class="container">
    <div class="columns">
      <div class="column is-9">
        <h1 class="title">Выберите места</h1>
        <div>TODO seat pick</div>
      </div>
      <div class="column is-3">
        <h2 class="title">Платите</h2>
        <div>
          <div
            v-for="(place) in selectedPlaces"
            :key="`${place.row}-${place.cell}`"
          >
            <div class="title is-4">Ряд {{place.row + 1}}, место {{place.cell + 1}} </div>
          </div>
        </div>
        <div class="title is-3">Итого: {{totalSum}}</div>
        <button
          class="button is-primary"
          v-if="!isPaying || payUntil > new Date()"
          @click="prepareForPayment"
        >Перейти к оплате</button>
        <div id="paypal-button"></div>
      </div>
    </div>
  </div>
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

@Component({

})
export default class PickSeat extends Vue {
  @Prop({ default: '' }) showtimeId!: string;
  name = 'PickSeat';
  // form

  isPaying: boolean = false;
  payUntil!: Date;

  selectedPlaces: TSFIX[] = [{
    row: 0,
    cell: 0,
  }, {
    row: 0,
    cell: 1,
  }];

  created() {
    MainModule.getShowtime(this.showtimeId);
  }

  get showtime() {
    return MainModule.showtimes[this.showtimeId];
  }

  get totalSum() {
    console.log(this.showtime);
    const hall = MainModule.halls[this.showtime ? this.showtime.hall : 'null'];
    if (!hall) {
      return '-';
    }
    return this.selectedPlaces.reduce((acc, curr) => acc + MainModule.hallCells[hall.structure[curr.row][curr.cell]].price / 100, 0);
  }

  @Watch('selectedPlaces')
  onSelectedPlacesChange() {
    this.renderPaymentButton();
  }

  async prepareForPayment() {
    const { data } = await api.post('payment/start', {
      seats: this.selectedPlaces,
      showtimeId: this.showtimeId
    });
    if (data.success) {
      this.payUntil = new Date(Date.now() + data.blockDuration);
      this.isPaying = true;
      this.renderPaymentButton();
    } else {
      alert('Cannot pay')
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
  async renderPaymentButton() {
    await this.waitForPaypal();
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
        const details = await actions.order.capture()
        // This function shows a transaction success message to your buyer.
        alert('Transaction completed by ' + details.payer.name.given_name);
        
      }
    }).render('#paypal-button');
  }
}

</script>