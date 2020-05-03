<template>
  <div>
    <div
      class="load-wrap"
      v-if="loading"
    >
     <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';

@Component
export default class Loader extends Vue {
  name = 'Loader';
  @Prop() loading: boolean;
}
</script>

<style lang="scss" scoped>
.load-wrap {
  margin-top: 2rem;
  display: flex;
  width: 100%;
  justify-content: center;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 250px;
  height: 250px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background:  $loader-color;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 16px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 16px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 64px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 112px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(48px, 0);
  }
}

</style>