<template>
  <p
    class="has-text-danger"
    :class="big ? {
      help: true, 
      'is-danger': true
      }: { 'big-error': true }"
    v-if="validation.$error && firstError !== null"
  >{{ firstError }}</p>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { non$keys } from './util';

@Component
export default class FormErrors extends Vue {
  name = 'FormErrors';

  @Prop() validation!: any;
  @Prop() errorTexts!: object;
  @Prop() big!: boolean;

  get firstError() {
    if (!this.validation)
      return null;
    for (const validatorKey of non$keys(this.validation)) {
      if (this.validation[validatorKey] === false) {
        return this.errorTexts[validatorKey];
      }
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
.big-error {
  font-size: 1.1rem;
}
</style>