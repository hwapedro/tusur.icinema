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
          class="button is-primary"
          :disabled="$v.$anyError"
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
import { Validate, Validations } from 'vuelidate-property-decorators';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Input from '../../shared/components/Input.vue';
import Label from '../../shared/components/Label.vue';
import FormErrors from '../../shared/components/FormErrors.vue';

@Component({
  components: {
    Input,
    Label,
    FormErrors
  }
})
export default class PickSeat extends Vue {
  @Prop({ default: '' }) showtimeId!: string;
  name = 'PickSeat';
  // form
  firstName = '';
  lastName = '';
  phone = '';

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

  selectedPlaces: TSFIX[] = [{
    row: 0,
    cell: 0,
  }, {
    row: 0,
    cell: 1,
  }];

  created() {
    if (!MainModule.showtimes[this.showtimeId])
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
    await this.$v.$touch();
    if (this.$v.$anyError) {
      return false;
    }
    const { data } = await api.post('payment/start', {
      seats: this.selectedPlaces,
      showtimeId: this.showtimeId
    });
    if (data.success) {
      this.payUntil = new Date(Date.now() + data.blockDuration);
      this.blockId = data.blockId;
      this.isPaying = true;
      this.renderPaymentButton();
    } else {
      if (status === 'taken') {
        alert('Cannot pay. Seats are blocked ' + JSON.stringify(data.seats));
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
        console.log(data);
        const { data: captureResult } = await api.post('payment/submit', {
          showtimeId: this.showtimeId,
          blockId: this.blockId,
          firstName: this.firstName,
          lastName: this.lastName,
          orderedItems: [],
          phone: this.phone,
          orderId: data.orderID,
        });
        console.log(captureResult);
      }
    }).render('#paypal-button');
  }
}

</script>