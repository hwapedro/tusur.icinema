export interface AgeRule {
  name: string;
}

export interface Actor {
  name: string;
  bio: string;
}

export interface Genre {
  name: string;
}

export interface Film {
  name: string;
  description: string;
  // in minutes
  duration: number;
  ageRule: AgeRule;
  releaseDate: Date;
  distributionStartDate: Date;
  distributionEndDate: Date;
  actors: Actor[];
  genres: Genre[];
}

export interface Cinema {
  name: string;
  address: string;
  halls: Hall[];
  shops: Shop[];
  films: Film[];
  showtimes: Showtime[];
}

export interface Showtime {
  time: Date;
  film: Film;
  halls: Hall[];
}

export enum HallCell {
  EMPTY,
  STANDARD,
  PREMIUM,
  VIP
}

export interface Hall {
  name: string;
  structure: HallCell[][];
}

export interface ShopItem {
  name: string;
  price: number;
  inStock: boolean;
}

export interface Shop {
  name: string;
  description: string;
  items: ShopItem[];
}