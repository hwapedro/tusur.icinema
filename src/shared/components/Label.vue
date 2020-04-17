<template>
  <label class="label">
    <slot></slot>
  </label>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';

@Component
export default class Label extends Vue {
  name = 'Label';
}
</script>

<style lang="scss" scoped>
</style>