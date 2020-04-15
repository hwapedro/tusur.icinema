import { Module, VuexModule, Mutation, Action, MutationAction, getModule } from 'vuex-module-decorators';
import { Film, Cinema, Hall, Shop, Showtime, HallCell } from '@/store/models';
import api from '@/api';
import { ModelMap } from '@/types';
import { Response } from './types';
import store from '@/store';
import { stateMerge } from 'vue-object-merge';

export interface IMainState {
  films: ModelMap<Film>;
  cinemas: ModelMap<Cinema>;
  halls: ModelMap<Hall>;
  hallCells: ModelMap<HallCell>;
  shops: ModelMap<Shop>;
  showtimes: ModelMap<Showtime>;
}

@Module({ dynamic: true, store, name: 'main' })
export default class Main extends VuexModule {
  films: ModelMap<Film> = {};
  cinemas: ModelMap<Cinema> = {};
  halls: ModelMap<Hall> = {};
  hallCells: ModelMap<HallCell> = {};
  shops: ModelMap<Shop> = {};
  showtimes: ModelMap<Showtime> = {};

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

  @Action
  async getShowtime(id: string) {
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
        model: 'cinemas',
        data: data.shops
      });
    }
    return data;
  }
}

export const MainModule = getModule(Main);
