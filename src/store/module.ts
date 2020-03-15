import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators';
import { Film, Cinema } from '@/types';
import api from '@/api';

@Module
export default class GlobalModule extends VuexModule {
  films: Film[] = [];
  cinemas: Cinema[] = [];

  @MutationAction({ mutate: ['cinemas', 'films'] })
  async fetchAll() {
    const { data } = await api.get('films/');
    return data;
  }
}