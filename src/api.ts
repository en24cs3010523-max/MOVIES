import type { Movie, User, Booking } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Movies
  getMovies: () => request<Movie[]>('/movies'),
  getMovie: (id: string) => request<Movie>(`/movies/${id}`),
  createMovie: (movie: Omit<Movie, '_id'>) =>
    request<Movie>('/movies', { method: 'POST', body: JSON.stringify(movie) }),
  updateMovie: (id: string, movie: Omit<Movie, '_id'>) =>
    request<Movie>(`/movies/${id}`, { method: 'PUT', body: JSON.stringify(movie) }),
  deleteMovie: (id: string) =>
    request<{ message: string }>(`/movies/${id}`, { method: 'DELETE' }),

  // Auth
  signup: (name: string, email: string, password: string) =>
    request<User>('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<User>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Bookings
  getBookings: (email: string) =>
    request<Booking[]>(`/bookings?email=${encodeURIComponent(email)}`),
  createBooking: (booking: Omit<Booking, '_id'>) =>
    request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),
  cancelBooking: (id: string) =>
    request<{ message: string }>(`/bookings/${id}`, { method: 'DELETE' }),
};
