import { Hall } from '~/store/models';

export const formatPrice = (number: number, suffix: boolean) => `${(number / 100).toFixed(2)}${suffix ? ' руб.' : ''}`;

/**
 * Shade given hex color. Percent > 0 -> lighten, otherwise darken
 */
export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent) / 100).toString());
  G = parseInt((G * (100 + percent) / 100).toString());
  B = parseInt((B * (100 + percent) / 100).toString());

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  let RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16));
  let GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16));
  let BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16));
  return '#' + RR + GG + BB;
}

export const getHallCells = (hall: Hall): number[] => {
  return Array.from((new Set(hall.structure.flatMap(row => row))).values());
}

export const uppercaseFirst = (str: string) => str[0].toUpperCase() + str.slice(1);