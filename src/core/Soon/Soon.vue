<template>
  <div class="soon">
    <h1>This is soon (afisha) page</h1>
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
export default class Soon extends Vue {
  name = 'Soon';

  mounted() {

  }
}

</script>