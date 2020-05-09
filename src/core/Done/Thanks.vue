<template>
  <div
    class="container"
  >
    <div class="columns">
      <div class="column">
        <article class="message is-primary">
          <div class="message-header">
            <p>Успешно</p>
          </div>
          <div class="message-body">
            Ваш заказ успешно оформлен. Ждем вас в нашем кинотеатре в назначенное время.<br>Благодарим за покупку!
          </div>
        </article>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from "vue-property-decorator";
import { State, Getter, Action, Mutation } from "vuex-class";
import { MainModule } from "../../store/modules/main";
import NewsPreview from "../Home/NewsPreview.vue";
import Loader from "../../shared/components/Loader.vue";
import { Debounce } from "vue-debounce-decorator";
import moment from "moment";
import {
  uppercaseFirst,
  formatFilmDuration,
  formatFilmDistributionRange
} from "../../shared/utils";

@Component({
  components: {
    NewsPreview,
    Loader
  }
})
export default class ThanksPage extends Vue {
  name = "ThanksPage";

  created() {

  }
}
</script>

<style lang="scss" scoped>
</style>