import { useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, Ticket } from 'lucide-react';
import { api } from '../api';
import type { Movie, User } from '../types';

interface CheckoutProps {
  movie: Movie;
  theater: string;
  showtime: string;
  seats: string[];
  total: number;
  user: User | null;
  onBack: () => void;
  onComplete: () => void;
  requireAuth: () => boolean;
}

export function Checkout({
  movie,
  theater,
  showtime,
  seats,
  total,
  user,
  onBack,
  onComplete,
  requireAuth,
}: CheckoutProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const confirm = async () => {
    setError('');
    if (!requireAuth()) return;
    if (!user) return;
    setSubmitting(true);
    try {
      await api.createBooking({
        userEmail: user.email,
        movieId: movie._id,
        movieTitle: movie.title,
        theater,
        showtime,
        seats,
        total,
      });
      setDone(true);
      setTimeout(onComplete, 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p className="text-slate-400">Your tickets have been saved. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to seats
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/15 grid place-items-center shrink-0">
            <Ticket className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg">{movie.title}</h3>
            <p className="text-sm text-slate-400">{theater} · {showtime}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-sm">
          <Row label="Seats" value={seats.join(', ')} />
          <Row label="Ticket count" value={`${seats.length} × $10`} />
          <div className="h-px bg-slate-800 my-3" />
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-medium">Total</span>
            <span className="text-2xl font-bold text-emerald-400">${total}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <CreditCard className="w-4 h-4" /> Payment is demo only — no charge.
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs text-slate-500">
          {[4, 5, 6].map((n) => (
            <div key={n} className="h-10 rounded-lg bg-slate-800/60 grid place-items-center font-mono">
              •••• {n}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <button
        onClick={confirm}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
          </>
        ) : (
          `Confirm Booking · $${total}`
        )}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-medium">{value}</span>
    </div>
  );
}
