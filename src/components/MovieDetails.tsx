import { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Calendar, Star } from 'lucide-react';
import type { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
  onBook: (theater: string, showtime: string) => void;
}

const THEATERS = [
  'Cinema Downtown',
  'Riverside Grand',
  'Westgate Mall',
];

const SHOWTIMES = ['10:00 AM', '1:15 PM', '7:45 PM'];

export function MovieDetails({ movie, onBack, onBook }: MovieDetailsProps) {
  const [theater, setTheater] = useState(THEATERS[0]);
  const [showtime, setShowtime] = useState(SHOWTIMES[0]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to movies
      </button>

      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="aspect-[2/3] bg-slate-800">
            {movie.image && (
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-2">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            {movie.genre}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {movie.duration || '2h 0min'}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Synopsis
            </h3>
            <p className="text-slate-300 leading-relaxed">{movie.desc}</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                <MapPin className="w-3.5 h-3.5 inline mr-1" /> Select Theater
              </label>
              <div className="flex flex-wrap gap-2">
                {THEATERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheater(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      theater === t
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                <Calendar className="w-3.5 h-3.5 inline mr-1" /> Select Showtime
              </label>
              <div className="flex flex-wrap gap-2">
                {SHOWTIMES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShowtime(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      showtime === s
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onBook(theater, showtime)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Select Seats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
