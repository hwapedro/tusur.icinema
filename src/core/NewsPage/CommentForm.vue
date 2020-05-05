<template>
  <div class="media">
    <div class="media-content">
      <div class="field">
        <p class="control">
          <textarea
            class="textarea"
            placeholder="Ваш комментарий"
            v-model="comment"
          ></textarea>
        </p>
      </div>
      <FormErrors
        :validation="$v.comment"
        big
        :errorTexts="{
        required: 'Введите комментарий',
        maxLength: `Слишком длинный комментарий, макс. длина: ${maxCommentLength}`
      }"
      />
      <div class="field">
        <p class="control">
          <button
            class="button"
            @click="onSend"
          >Отправить</button>
        </p>
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

const MAX_COMMENT_LENGTH = 1000;

@Component({
  components: {
    FormErrors
  }
})
export default class CommentForm extends Vue {
  name = 'CommentForm';
  maxCommentLength = MAX_COMMENT_LENGTH;
  comment: string = '';

  @Validations()
  validations = {
    comment: {
      required,
      maxLength: maxLength(MAX_COMMENT_LENGTH),
    },
  }

  async onSend() {
    await (this as any).$v.$touch();
    if ((this as any).$v.$anyError) {
      return false;
    }
    this.$emit('send-comment', {
      text: this.comment
    });
    this.comment = '';
    (this as any).$v.$reset();
  }

  mounted() {
  }
}

</script>

<style lang="scss" scoped>
.template-img {
  background: #fac;
}
</style>