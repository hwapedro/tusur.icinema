<template>
  <Loader :loading="!(newsItem && newsItem.title)">
    <div class="container">
      <div class="columns">
        <div class="column">
          <h1 class="title is-1">{{newsItem ? newsItem.title : ''}}</h1>
          <div class="subtitle">{{newsDate}}</div>
          <hr>
          <div class="content">{{newsText}}</div>
          <hr>
          <!-- comments -->
          <Comment
            v-for="commentId in sortedCommentsKeys.reverse()"
            :key="commentId"
            :comment="comments[commentId]"
          />
          <!-- paginator -->
          <Paginator
            :take="take"
            :page="page"
            :hasMore="paginator.hasMore"
            :total="paginator.total"
            @page-next="onPageNext"
            @page-prev="onPagePrev"
          />
          <!-- write yours -->
          <CommentForm @send-comment="onSendComment" />
        </div>
      </div>
    </div>
  </Loader>
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
import { MainModule } from '../../store/modules/main';
import api from '../../api';
import { Validate, Validations } from 'vuelidate-property-decorators';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Input from '../../shared/components/Input.vue';
import Label from '../../shared/components/Label.vue';
import Loader from '../../shared/components/Loader.vue';
import Comment from './Comment.vue';
import CommentForm from './CommentForm.vue';
import FormErrors from '../../shared/components/FormErrors.vue';
import { ModelMap, Pagination } from "../../types";
import { Genre, Showtime, Hall, HallCell, AgeRule, Cinema, Film } from '../../store/models';
import { formatPrice } from '../../shared/utils';
import { HOURS_MERGED } from '../../shared/constants';
import { Bus } from '../../shared/bus';
import SeatPicker from './SeatPicker.vue';
import AlertIcon from 'vue-ionicons/dist/js/md-alert'
import Paginator from '../../shared/components/Paginator.vue';

const EL_LENGTH = 150;

@Component({
  components: {
    Loader,
    Comment,
    Paginator,
    CommentForm
  }
})
export default class NewsPage extends Vue {
  name = 'NewsPage';
  @Prop() newsId!: string;
  commnentsLoading: boolean = false;
  skip: number = 0;
  take: number = process.env.NODE_ENV === 'development' ? 2 : 15;

  mounted() {
    MainModule.fetchNews({
      id: this.newsId, 
      take: this.take
    });
  }

  fetchComments() {
    try {
      this.commnentsLoading = true;
      MainModule.fetchComments({
        newsId: this.newsId,
        pagination: {
          take: this.take,
          skip: this.skip
        }
      });
    } finally {
      this.commnentsLoading = false;
    }
  }

  onPageNext() {
    this.skip = this.skip + this.take;
    this.fetchComments();
  }
  onPagePrev() {
    this.skip = Math.max(0, this.skip - this.take);
    this.fetchComments();
  }

  get page() {
    return Math.floor(this.skip / this.take);
  }
  get paginator(): Pagination {
    return MainModule.commentsPagination;
  }

  onSendComment(comment: any) {
    MainModule.sendComment({ newsId: this.newsId, comment });
  }

  get sortedCommentsKeys() {
    return Object.keys(this.comments).sort((a, b) =>
      Math.sign(moment(a).diff(moment(b))));
  }

  get comments() {
    return MainModule.comments;
  }
  get newsItem(): NewsItem {
    return MainModule.news[this.newsId] || null;
  }
  get newsDate() {
    return this.newsItem ? moment(this.newsItem.date).format('DD MMM YYYY') : '';
  }
  get newsText() {
    return this.newsItem ? this.newsItem.text : '';
  }
}

</script>

<style lang="scss" scoped>
</style>