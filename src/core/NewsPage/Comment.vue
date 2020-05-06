<template>
  <div class="card comment is-rounded">
    <div class="card-content">
      <p class="comment-text">
        {{commentText}}
      </p>
      <p class="comment-time">
        {{commentTime}}
      </p>
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
import { NewsItem, NewsComment } from '../../store/models';
import moment from 'moment';
import { MainModule } from '../../store/modules/main';
import api from '../../api';
import { Validate, Validations } from 'vuelidate-property-decorators';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Input from '../../shared/components/Input.vue';
import Label from '../../shared/components/Label.vue';
import Loader from '../../shared/components/Loader.vue';
import FormErrors from '../../shared/components/FormErrors.vue';
import { ModelMap } from "../../types";
import { Genre, Showtime, Hall, HallCell, AgeRule, Cinema, Film } from '../../store/models';
import { formatPrice } from '../../shared/utils';
import { HOURS_MERGED } from '../../shared/constants';
import { Bus } from '../../shared/bus';
import SeatPicker from './SeatPicker.vue';
import AlertIcon from 'vue-ionicons/dist/js/md-alert'

@Component({
  components: {
    Loader
  }
})
export default class Comment extends Vue {
  name = 'Comment';
  @Prop() comment!: NewsComment;

  mounted() {
  }

  get commentText() {
    return this.comment ? this.comment.text : '';
  }
  get commentTime() {
    return this.comment ? moment(this.comment.date).format('DD MMM YYYY, HH:mm') : '';
  }
}

</script>

<style lang="scss" scoped>
.template-img {
  background: #fac;
}
.comment {
  margin-bottom: 1rem;
  border-radius: .5rem;
  .card-content {
    padding: .7rem;
  }
  &-text {
    font-size: 1.2rem;
    font-weight: 400;
  }
}
</style>