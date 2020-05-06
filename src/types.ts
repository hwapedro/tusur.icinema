export interface Pagination {
  skip?: number;
  take?: number;
  hasMore: boolean;
  total: number;
  page: number;
}

export type ModelMap<T> = {
  [key in string | number]: T
}