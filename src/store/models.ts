interface WithOid {
  _id: string;
}

export interface AgeRule extends WithOid {
  name: string;
}

export interface Actor extends WithOid {
  name: string;
  bio: string;
}

export interface Genre extends WithOid {
  name: string;
}

export interface Film extends WithOid {
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

export interface Cinema extends WithOid {
  name: string;
  address: string;
  halls: Hall[];
  shops: Shop[];
  films: Film[];
  showtimes: Showtime[];
}

export interface Showtime extends WithOid {
  time: Date;
  film: string;
  hall: string;
}

export interface HallCell extends WithOid {
  name: string;
  price: number;
  index: number;
}

export interface Hall extends WithOid {
  name: string;
  structure: number[][];
}

export interface ShopItem extends WithOid {
  name: string;
  price: number;
  inStock: boolean;
}

export interface Shop extends WithOid {
  name: string;
  description: string;
  items: ShopItem[];
}