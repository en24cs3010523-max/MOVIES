import { useMemo, useState } from 'react';
import { ArrowLeft, Armchair, Monitor } from 'lucide-react';
import type { Movie } from '../types';

interface SeatSelectionProps {
  movie: Movie;
  theater: string;
  showtime: string;
  onBack: () => void;
  onConfirm: (seats: string[], total: number) => void;
}

const ROWS = 'ABCDEFGH'.split('');
const COLS = 8;
const PRICE = 10;

export function SeatSelection({ movie, theater, showtime, onBack, onConfirm }: SeatSelectionProps) {
  const booked = useMemo(() => {
    const set = new Set<string>();
    ROWS.forEach((r) => {
      for (let c = 1; c <= COLS; c++) {
        if (Math.random() < 0.3) set.add(`${r}${c}`);
      }
    });
    return set;
  }, []);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (seat: string) => {
    if (booked.has(seat)) return;
    const next = new Set(selected);
    if (next.has(seat)) next.delete(seat);
    else next.add(seat);
    setSelected(next);
  };

  const total = selected.size * PRICE;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {movie.title}
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Select Your Seats</h1>
        <p className="text-slate-400 text-sm mt-1">
          {movie.title} · {theater} · {showtime}
        </p>
      </div>

      <div className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="mx-auto mb-8 flex items-center justify-center gap-2 text-slate-500">
          <Monitor className="w-6 h-6" />
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full" />
        </div>

        <div className="flex flex-col items-center gap-2.5">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-2.5">
              <span className="w-5 text-xs font-medium text-slate-500 text-right">{row}</span>
              {Array.from({ length: COLS }, (_, i) => i + 1).map((col) => {
                const seat = `${row}${col}`;
                const isBooked = booked.has(seat);
                const isSelected = selected.has(seat);
                return (
                  <button
                    key={seat}
                    onClick={() => toggle(seat)}
                    disabled={isBooked}
                    title={seat}
                    className={`w-9 h-9 rounded-lg grid place-items-center transition-all ${
                      isBooked
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-500 text-slate-950 scale-110 shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Armchair className="w-4 h-4" />
                  </button>
                );
              })}
              <span className="w-5 text-xs font-medium text-slate-500">{row}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-400 mb-6">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-700" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-500" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-800" /> Booked
        </span>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            {selected.size === 0
              ? 'No seats selected'
              : `${selected.size} seat${selected.size > 1 ? 's' : ''}: ${[...selected].join(', ')}`}
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            ${total} <span className="text-sm font-normal text-slate-400">($10/seat)</span>
          </p>
        </div>
        <button
          disabled={selected.size === 0}
          onClick={() => onConfirm([...selected].sort(), total)}
          className="px-8 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
