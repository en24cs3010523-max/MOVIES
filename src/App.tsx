import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { fallbackMovies } from './fallbackMovies';
import type { Booking, Movie, User, View } from './types';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { Home } from './components/Home';
import { MovieDetails } from './components/MovieDetails';
import { SeatSelection } from './components/SeatSelection';
import { Checkout } from './components/Checkout';
import { Dashboard } from './components/Dashboard';
import { Admin } from './components/Admin';

const SEAT_FLOW = { theater: '', showtime: '', seats: [] as string[], total: 0 };

export default function App() {
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [flow, setFlow] = useState(SEAT_FLOW);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('imovies_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const reloadMovies = useCallback(() => {
    api
      .getMovies()
      .then((data) => setMovies(data.length > 0 ? data : fallbackMovies))
      .catch(() => setMovies(fallbackMovies));
  }, []);

  useEffect(() => {
    reloadMovies();
  }, [reloadMovies]);

  const login = (u: User) => {
    localStorage.setItem('imovies_user', JSON.stringify(u));
    setUser(u);
    setView('home');
  };

  const logout = () => {
    localStorage.removeItem('imovies_user');
    setUser(null);
    setView('home');
  };

  const requireAuth = (): boolean => {
    if (!user) {
      setView('auth');
      return false;
    }
    return true;
  };

  const selectMovie = (m: Movie) => {
    setSelected(m);
    setView('details');
  };

  const startBooking = (theater: string, showtime: string) => {
    if (!requireAuth()) return;
    setFlow({ ...SEAT_FLOW, theater, showtime });
    setView('seats');
  };

  const confirmSeats = (seats: string[], total: number) => {
    setFlow((f) => ({ ...f, seats, total }));
    setView('checkout');
  };

  const bookingComplete = () => {
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar view={view} setView={setView} user={user} onLogout={logout} />

      {view === 'home' && <Home onSelectMovie={selectMovie} />}

      {view === 'auth' && <Auth onLogin={login} onBack={() => setView('home')} />}

      {view === 'details' && selected && (
        <MovieDetails
          movie={selected}
          onBack={() => setView('home')}
          onBook={startBooking}
        />
      )}

      {view === 'seats' && selected && (
        <SeatSelection
          movie={selected}
          theater={flow.theater}
          showtime={flow.showtime}
          onBack={() => setView('details')}
          onConfirm={confirmSeats}
        />
      )}

      {view === 'checkout' && selected && (
        <Checkout
          movie={selected}
          theater={flow.theater}
          showtime={flow.showtime}
          seats={flow.seats}
          total={flow.total}
          user={user}
          onBack={() => setView('seats')}
          onComplete={bookingComplete}
          requireAuth={requireAuth}
        />
      )}

      {view === 'dashboard' && user && <Dashboard user={user} />}

      {view === 'admin' && <Admin movies={movies} reloadMovies={reloadMovies} />}

      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-sm text-slate-500">
        IMovies · Modern Cinema Booking · Built with the MERN stack
      </footer>
    </div>
  );
}
