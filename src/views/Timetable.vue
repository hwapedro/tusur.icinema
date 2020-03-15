<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <h1 class="title">Расписание</h1>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { Film, Genre, Actor } from '../types';

@Component
export default class Timetable extends Vue {
  @Prop() film!: Film;

  mounted() {

  }
}

</script>

<style lang="scss" scoped>
</style>