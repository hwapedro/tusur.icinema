<template>
  <article class="media">
    <figure class="media-left">

    </figure>
    <div class="media-content is-hoverable">
      <div class="content">
        <div class="title is-4 is-marginless">
          <router-link
            class="title is-4 is-marginless"
            :to="`/news/${item._id}`"
          >{{item.title}}</router-link>
        </div>
        <p><small>{{newsDate}}</small></p>
        <p>{{ellipsis}}</p>
      </div>
    </div>
    <div class="media-right">
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

const EL_LENGTH = 150;

@Component
export default class NewsPreview extends Vue {
  name = 'NewsPreview';
  @Prop() item: NewsItem;
  mounted() {

  }

  get newsDate() {
    return moment(this.item.date).format('DD MMM YYYY');
  }
  get ellipsis() {
    return this.item.text.length > EL_LENGTH ? this.item.text.slice(0, EL_LENGTH) + '...' : this.item.text;
  }
}

</script>