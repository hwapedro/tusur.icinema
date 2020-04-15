<template>

</template>
 
<script lang="ts">
import { Component, Prop, Vue, Inject, } from "vue-property-decorator";
import { Film } from '../../store/models';

@Component
export default class TimetableRow extends Vue {
  @Prop() film!: Film;

  mounted() {

  }
}
</script>

<style lang="scss" scoped>
</style>