export const isDev = process.env.NODE_ENV == 'development' ? true: false;
export const HOURS_MERGED: number = 2;
  export enum CELL_STATE {
  FORBIDDEN,
  TAKEN,
  FREE,
  SELECTED,
}
export const COLOR_TAKEN = '#5d5d5d';
export const COLOR_SELECTED = '#48c774';
export const COLOR_FORBIDDEN = 'none'; // '#ccc';
