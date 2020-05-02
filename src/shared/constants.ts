export const isDev = process.env.NODE_ENV == 'development' ? true: false;
export const HOURS_MERGED: number = 2;
export const COLOR_TAKEN = '#eaeaea';
export enum CELL_STATE {
  FORBIDDEN,
  TAKEN,
  FREE,
  SELECTED,
}
export const COLOR_SELECTED = '#48c774';
export const COLOR_FORBIDDEN = '#ccc';
