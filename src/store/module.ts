import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators';
import { Film, Cinema } from '@/types';
import api from '@/api';

@Module
export default class GlobalModule extends VuexModule {
  films: Film[] = [];
  cinemas: Cinema[] = [];

  @Mutation
  setAll(data: any) {
    console.log(data);
  }

  @Action({ commit: 'setAll', rawError: true })
  async fetchAll() {
    const { data } = await api.query('cinemas', {});
    return data;
  }
}