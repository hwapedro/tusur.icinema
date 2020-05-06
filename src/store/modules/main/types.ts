import { Cinema, Hall, Shop, HallCell, Genre, AgeRule } from '@/store/models';
import { BaseResponse } from '@/api/types';

export namespace Response {
  export interface GetAll extends BaseResponse {
    cinemas: Cinema[];
    halls: Hall[];
    hallCells: HallCell[];
    shops: Shop[];
    ageRules: AgeRule[];
    genres: Genre[];
  }
}

export interface PaginationQuery {
  skip: number;
  take: number;
}