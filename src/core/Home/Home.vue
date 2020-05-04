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

@Component({
  components: {
    NewsPreview,
    Loader,
  }
})
export default class Home extends Vue {
  name = 'Home';
  newsLoading = true;

  mounted() {
    this.fetchNews();
  }

  async fetchNews() {
    this.newsLoading = true;
    await MainModule.getNews({ skip: 0, take: 10 });
    this.newsLoading = false;
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