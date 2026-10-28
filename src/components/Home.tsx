import { useEffect, useMemo, useState } from 'react';
import { Search, Star, Clock, Film, Loader2 } from 'lucide-react';
import { api } from '../api';
import { fallbackMovies } from '../fallbackMovies';
import type { Movie } from '../types';

interface HomeProps {
  onSelectMovie: (m: Movie) => void;
}

export function Home({ onSelectMovie }: HomeProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');


  useEffect(() => {
    api
      .getMovies()
      .then((data) => setMovies(data.length > 0 ? data : fallbackMovies))
      .catch((e) => {
        setMovies(fallbackMovies);
        console.warn('getMovies failed, using fallback:', e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return movies.filter(
      (m) => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
    );
  }, [movies, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="relative mb-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or genres..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Now Showing</h2>
        <span className="text-sm text-slate-400">{filtered.length} movies</span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading movies...
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-24 text-slate-400">
          <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
          No movies found.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filtered.map((movie) => (
          <button
            key={movie._id}
            onClick={() => onSelectMovie(movie)}
            className="group text-left rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
              {movie.image ? (
                <img
                  src={movie.image}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-slate-600">
                  <Film className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/70 backdrop-blur text-xs text-emerald-400 font-medium">
                <Star className="w-3 h-3 fill-emerald-400" />
                {movie.genre}
              </div>
            </div>
            <div className="p-3.5">
              <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                {movie.title}
              </h3>
              <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <Clock className="w-3 h-3" />
                {movie.duration || '2h 0min'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
