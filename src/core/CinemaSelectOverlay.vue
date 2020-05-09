<template>
  <div
    class="modal"
    :class="{
      'is-active': modalActive,
      }"
  >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Выберите кинотеатр</p>
      </header>
      <section class="modal-card-body">
        <div class="select is-fullwidth">
          <select v-model="selection">
            <option
              value="HEHE XD"
              selected
              disabled
            >Выберите интересующий кинотеатр</option>
            <option
              v-for="cinema in cinemas"
              :value="cinema._id"
              :key="cinema._id"
            >{{cinema.name}} ({{cinema.address}})</option>
          </select>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-fullwidth is-success"
          :disabled="!selectedSomething"
          @click="onSave"
        >Сохранить</button>
      </footer>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from "vue-property-decorator";
import moment from 'moment';
import { uppercaseFirst } from '../shared/utils';
moment.locale('ru');
import { MainModule } from "../store/modules/main";

const DEFAULT_SELECTION = 'HEHE XD';

@Component
export default class CinemaSelectOverlay extends Vue {
  name = 'CinemaSelectOverlay';
  @Prop() modalActive: boolean;
  active: boolean = false;
  animateActive: boolean = false;
  selection: string = DEFAULT_SELECTION;

  mounted() {
  }

  onSave() {
    MainModule.setCinema(this.selection);
    this.$emit('cinema-selected');
  }

  get selectedSomething() {
    return this.selection !== DEFAULT_SELECTION;
  }
  get cinemas() {
    return MainModule.cinemas;
  }
}
</script>

<style lang="scss" scoped>
</style>