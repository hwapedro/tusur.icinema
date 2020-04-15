import { Cinema, Hall, Shop, HallCell } from '@/store/models';
import { BaseResponse } from '@/api/types';

export namespace Response {
  export interface GetAll extends BaseResponse {
    cinemas: Cinema[];
    halls: Hall[];
    hallCells: HallCell[];
    shops: Shop[];
  }
}