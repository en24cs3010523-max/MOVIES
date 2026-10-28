import { useEffect, useState } from 'react';
import { Loader2, Ticket, Trash2, Calendar, MapPin, Clock } from 'lucide-react';
import { api } from '../api';
import type { Booking, User } from '../types';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api
      .getBookings(user.email)
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user.email]);

  const cancel = async (id: string) => {
    setCancelling(id);
    try {
      await api.cancelBooking(id);
      setBookings((b) => b.filter((x) => x._id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Tickets</h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back, {user.name} — your booking history.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading bookings...
        </div>
      )}

      {error && (
        <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
          No bookings yet. Go pick a movie!
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 grid place-items-center shrink-0">
                <Ticket className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{b.movieTitle}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {b.theater}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {b.showtime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {b.seats.join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-emerald-400">${b.total}</span>
              <button
                onClick={() => b._id && cancel(b._id)}
                disabled={cancelling === b._id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-rose-400 hover:bg-rose-500/15 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {cancelling === b._id ? 'Cancelling...' : 'Cancel Ticket'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
