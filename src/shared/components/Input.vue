<template>
  <div class="control">
    <input
      :type="type"
      class="input"
      v-model="content"
      @blur="$emit('blur')"
      @input="handleInput"
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from 'vue-property-decorator';

@Component
export default class Input extends Vue {
  @Prop() type!: string;
  @Prop({ required: false, type: String }) value!: string;
  content = '';

  name = 'Input';

  handleInput(e) {
    this.$emit('input', this.content);
  }
}
</script>

<style lang="scss" scoped>
</style>