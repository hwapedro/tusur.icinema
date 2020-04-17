<template>
  <p
    class="help is-danger"
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
</style>