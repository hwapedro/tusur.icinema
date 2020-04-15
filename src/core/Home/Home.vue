<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from 'vue-property-decorator';
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';

@Component
export default class Home extends Vue {
  name = 'Home';

  mounted() {

  }
}

</script>