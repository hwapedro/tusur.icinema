<template>
  <Loader :loading="filmLoading">
    <div class="container">
      <div class="columns">
        <div class="column is-3-desktop is-12-mobile">
          <figure class="image is-fullwidth">
            <img :src="film.image" />
          </figure>
        </div>
        <div class="column is-8-desktop is-12-mobile">
          <div class="title is-3">{{film.name}}</div>
          <hr />
          <div class="film-infos">
            <div class="film-info">
              <div class="film-info__title">Год</div>
              <div class="film-info__value">{{filmYear}}</div>
            </div>
            <div class="film-info">
              <div class="film-info__title">Жанр</div>
              <div class="film-info__value">{{ filmGenre }}</div>
            </div>
            <div class="film-info">
              <div class="film-info__title">Актеры</div>
              <div class="film-info__value">{{filmActors}}</div>
            </div>
            <div class="film-info">
              <div class="film-info__title">Продолжительность</div>
              <div class="film-info__value">{{filmDuration}}</div>
            </div>
            <div class="film-info">
              <div class="film-info__title">В прокате</div>
              <div class="film-info__value">{{ filmDistributionRange }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12-desktop is-12-mobile">
          <div class="subtitle">Новости</div>
          <NewsPreview v-for="newsItem in filmNews" :item="newsItem" :key="newsItem._id" />
        </div>
      </div>
    </div>
  </Loader>
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
import { Film } from "../../store/models";

@Component({
  components: {
    NewsPreview,
    Loader
  }
})
export default class FilmPage extends Vue {
  name = "FilmPage";
  filmLoading = true;
  @Prop() filmId!: string;

  created() {
    this.filmLoading = true;
    MainModule.getFilm(this.filmId);
    this.filmLoading = false;
  }

  get film() {
    return MainModule.film[this.filmId];
  }
  get filmYear() {
    return moment(this.film.distributionStartDate).format("YYYY");
  }
  get filmActors() {
    return this.film.actors.map(actor => actor.name).join(", ");
  }
  get filmGenre() {
    return this.film.genres.map(genre => genre.name.toLowerCase()).join(", ");
  }
  get filmDuration() {
    return formatFilmDuration(this.film.duration);
  }
  get filmNews() {
    return this.film.news;
  }
  get filmDistributionRange() {
    return formatFilmDistributionRange(
      this.film.distributionStartDate,
      this.film.distributionEndDate
    );
  }
}
</script>

<style lang="scss" scoped>
.in-film-button {
  margin-top: 5px;
  text-align: right;
}
.subtitle {
  margin-top: 55px;
}
.film-info {
  display: flex;
  font-size: 1.2rem;

  &:not(:last-child) {
    .film-info__title {
      border-bottom: 1px solid rgb(224, 220, 220);
    }
    .film-info__value {
      border-bottom: 1px solid rgb(143, 143, 143);
    }
  }
  &__title {
    width: 30%;
    color: $keyval-color;
  }
  &__value {
    flex-grow: 1;
  }
}
</style>