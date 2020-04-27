import { Module, VuexModule, Mutation, Action, MutationAction, getModule } from 'vuex-module-decorators';
import { Film, Cinema, Hall, Shop, Showtime, HallCell, AgeRule, Genre } from '@/store/models';
import api from '@/api';
import { ModelMap } from '@/types';
import { Response } from './types';
import store from '@/store';
import { stateMerge } from 'vue-object-merge';

export interface IMainState {
  // id of selected cinema
  cinema: string;

  films: ModelMap<Film>;
  cinemas: ModelMap<Cinema>;
  halls: ModelMap<Hall>;
  hallCells: ModelMap<HallCell>;
  shops: ModelMap<Shop>;
  showtimes: ModelMap<Showtime>;
}

@Module({ dynamic: true, store, name: 'main' })
export default class Main extends VuexModule {
  cinema: string = '';
  films: ModelMap<Film> = {};
  cinemas: ModelMap<Cinema> = {};
  halls: ModelMap<Hall> = {};
  hallCells: ModelMap<HallCell> = {};
  shops: ModelMap<Shop> = {};
  showtimes: ModelMap<Showtime> = {};
  ageRules: ModelMap<AgeRule> = {};
  genres: ModelMap<Genre> = {};
  dateShowtimes: { [key: string]: ModelMap<Showtime> } = {};

  @Mutation
  setModels({ model, data }: {
    model: string,
    data: any
  }) {
    const newData = {};
    for (const index in data) {
      const entry = data[index];
      newData[entry._id] = entry;
    }
    stateMerge(this[model], newData);
  }

  @Mutation
  setHallCells(data) {
    const newData = {};
    for (const itemIndex in data) {
      const hallCell = data[itemIndex];
      newData[hallCell.index] = hallCell;
    }
    stateMerge(this.hallCells, newData);
  }

  @Mutation
  setDateShowtimes(showtimes) {
    const newData = {};
    for (const entry of showtimes) {
      const { date, showtimes } = entry;
      newData[date] = showtimes;
    }
    stateMerge(this.dateShowtimes, newData);
  }

  @Action
  async getShowtime(id: string) {
    try {
      const { data } = await api.get(`schedule/showtime/${id}`);
      if (data.success) {
        this.setModels({
          model: 'halls',
          data: [data.hall],
        });
        this.setModels({
          model: 'films',
          data: [data.film],
        });
        this.setHallCells(data.hallCells);
        this.setModels({
          model: 'showtimes',
          data: [data.showtime],
        });
      }
    } catch (error) {

    }
  }

  @Action
  async fetchTimetable(from: Date) {
    const { data: {
      showtimes,
      films,
      halls,
      hallCells
    } } = await api.get<any>('schedule/showtime', {
      from: from.toISOString().slice(0, 10),
      cinema: this.cinema,
    });
    this.setDateShowtimes(showtimes);
    this.setModels({
      model: 'films',
      data: films,
    });
    this.setModels({
      model: 'hallCells',
      data: hallCells,
    });
    this.setModels({
      model: 'halls',
      data: halls,
    });
  }

  @Action
  async fetchAll() {
    const { data } = await api.get<Response.GetAll>('general/all');
    console.log(data);
    if (data.success) {
      this.setModels({
        model: 'cinemas',
        data: data.cinemas
      });
      this.setModels({
        model: 'halls',
        data: data.halls
      });
      this.setHallCells(data.hallCells);
      this.setModels({
        model: 'shops',
        data: data.shops
      });
      this.setModels({
        model: 'ageRules',
        data: data.ageRules
      });
      this.setModels({
        model: 'genres',
        data: data.genres
      });
    }
    return data;
  }

  @MutationAction({ mutate: ['cinema'] })
  async setCinema(value: string) {
    return {
      cinema: value
    };
  }
}

export const MainModule = getModule(Main);
