<template>
  <article class="media">
    <figure class="media-left">

    </figure>
    <div class="media-content">
      <div class="content">
        <div class="title is-4">{{item.title}}</div>
        <p><small>{{newsDate}}</small></p>  
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-reply"></i></span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-retweet"></i></span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-heart"></i></span>
          </a>
        </div>
      </nav>
    </div>
    <div class="media-right">
      <button class="delete"></button>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, } from 'vue-property-decorator';
import {
  State,
  Getter,
  Action,
  Mutation
} from 'vuex-class';
import { NewsItem } from '../../store/models';
import moment from 'moment';

@Component
export default class NewsPreview extends Vue {
  name = 'NewsPreview';
  @Prop() item: NewsItem;
  mounted() {

  }

  get newsDate() {
    return moment().from(this.item.date);
  }
}

</script>