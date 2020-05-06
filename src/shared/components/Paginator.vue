<template>
  <nav
    class="pagination is-rounded is-centered"
    role="navigation"
    aria-label="pagination"
  >
    <div class="container">
      <ul class="pagination-list">
        <li v-if="page > 0">
          <a
            class="pagination-link"
            @click="onPrev"
          >
            <ArrowBack />
          </a>
        </li>
        <li v-if="pageCounter.length">
          <a class="pagination-link is-static">{{pageCounter}}</a>
        </li>
        <li v-if="hasMore">
          <a
            class="pagination-link"
            @click="onNext"
          >
            <ArrowForward /></a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch, Emit } from 'vue-property-decorator';
import ArrowBack from 'vue-ionicons/dist/js/md-arrow-back';
import ArrowForward from 'vue-ionicons/dist/js/md-arrow-forward';

@Component({
  components: {
    ArrowBack,
    ArrowForward
  }
})
export default class Paginator extends Vue {
  name = 'Paginator';
  @Prop() total!: number;
  @Prop() take!: number;
  @Prop() page!: number;
  @Prop() hasMore!: boolean;

  @Emit('page-next')
  onNext() {
    return null;
  }

  @Emit('page-prev')
  onPrev() {
    return null;
  }

  get totalPages() {
    return Math.ceil(this.total / this.take);
  }
  get pageCounter() {
    return this.totalPages <= this.take
      ? ''
      : `${this.page + 1} / ${this.totalPages}`;
  }
}
</script>

<style lang="scss" scoped>
</style>