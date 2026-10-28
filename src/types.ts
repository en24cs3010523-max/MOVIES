export interface Movie {
  _id: string;
  title: string;
  genre: string;
  duration: string;
  image: string;
  desc: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id?: string;
  userEmail: string;
  movieId?: string;
  movieTitle: string;
  theater: string;
  showtime: string;
  seats: string[];
  total: number;
  createdAt?: string;
}

export type View =
  | 'home'
  | 'details'
  | 'seats'
  | 'checkout'
  | 'dashboard'
  | 'admin'
  | 'auth';
