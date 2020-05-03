<template>
    <!-- render news -->
    <div class="conlumns">
      <div class="column">
        <NewsPreview 
          v-for="newsItem in news"
          :key="newsItem._id"
        />
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
import NewsPreview from'./NewsPreview.vue';
import { MainModule } from '../../store/modules/main';

@Component
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
}

</script>