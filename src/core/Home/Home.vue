<template>
  <div class="container timetable">
    <div class="columns">
      <div class="column">
        <h1 class="title">{{cinema ? cinemas[cinema].name : ''}}</h1>
        <div class="subtitle">Новости</div>
        <Loader :loading="newsLoading">
          <NewsPreview
            v-for="newsItem in news"
            :item="newsItem"
            :key="newsItem._id"
          />
          <hr>
          <Paginator
            :take="take"
            :page="page"
            :hasMore="paginator.hasMore"
            :total="paginator.total"
            @page-next="onPageNext"
            @page-prev="onPagePrev"
          />
        </Loader>
      </div>
    </div>
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
import NewsPreview from './NewsPreview.vue';
import { MainModule } from '../../store/modules/main';
import Loader from '../../shared/components/Loader.vue';
import Paginator from '../../shared/components/Paginator.vue';
import { Pagination } from '../../types';

@Component({
  components: {
    NewsPreview,
    Loader,
    Paginator
  }
})
export default class Home extends Vue {
  name = 'Home';
  newsLoading = true;
  skip: number = 0;
  take: number = 2;

  mounted() {
    this.fetchNews();
  }

  async fetchNews() {
    this.newsLoading = true;
    await MainModule.getNews({
      take: this.take,
      skip: this.skip
    });
    this.newsLoading = false;
  }

  onPageNext() {
    this.skip = this.skip + this.take ;
    this.fetchNews();
  }
  onPagePrev() {
    this.skip = Math.max(0, this.skip - this.take);
    this.fetchNews();
  }

  get page() {
    return Math.floor(this.skip / this.take);
  }
  get paginator(): Pagination {
    return MainModule.newsPagination;
  }
  get news() {
    return MainModule.news;
  }
  get cinema() {
    return MainModule.cinema;
  }
  get cinemas() {
    return MainModule.cinemas;
  }
}

</script>