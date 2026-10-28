import { useState } from 'react';
import {
  Shield, Lock, User as UserIcon, KeyRound, Plus, Pencil, Trash2, X, Film, Loader2,
} from 'lucide-react';
import { api } from '../api';
import type { Movie } from '../types';

const ADMIN_USER = 'en24cs3010523@admin';
const ADMIN_PASS = 'en24cs3010523';

interface AdminProps {
  movies: Movie[];
  reloadMovies: () => void;
}

export function Admin({ movies, reloadMovies }: AdminProps) {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 grid place-items-center mb-4">
              <Shield className="w-7 h-7 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Admin Access</h2>
            <p className="text-slate-400 text-sm mt-1">Hardcoded credentials required</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (user === ADMIN_USER && pass === ADMIN_PASS) {
                setAuthed(true);
                setError('');
              } else {
                setError('Invalid admin credentials');
              }
            }}
            className="space-y-4"
          >
            <Field icon={<UserIcon className="w-4 h-4" />} label="Username">
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
                placeholder="admin@example.com"
              />
            </Field>
            <Field icon={<KeyRound className="w-4 h-4" />} label="Password">
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
                placeholder="••••••••"
              />
            </Field>
            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-400 transition-colors"
            >
              <Lock className="w-4 h-4" /> Unlock Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel movies={movies} reloadMovies={reloadMovies} />;
}

function AdminPanel({ movies, reloadMovies }: AdminProps) {
  const empty = { title: '', genre: '', duration: '', image: '', desc: '' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const setField = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await api.updateMovie(editingId, form);
      } else {
        await api.createMovie(form);
      }
      setForm(empty);
      setEditingId(null);
      reloadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const edit = (m: Movie) => {
    setEditingId(m._id);
    setForm({
      title: m.title,
      genre: m.genre,
      duration: m.duration,
      image: m.image,
      desc: m.desc,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    setDeleting(id);
    try {
      await api.deleteMovie(id);
      reloadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-rose-400" />
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white flex items-center gap-2">
            {editingId ? <Pencil className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4 text-emerald-400" />}
            {editingId ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
          <Input label="Title" value={form.title} onChange={(v) => setField('title', v)} placeholder="Movie title" />
          <Input label="Genre" value={form.genre} onChange={(v) => setField('genre', v)} placeholder="Action, Drama..." />
          <Input label="Duration" value={form.duration} onChange={(v) => setField('duration', v)} placeholder="2h 12min" />
          <Input label="Poster URL" value={form.image} onChange={(v) => setField('image', v)} placeholder="https://..." />
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.desc}
              onChange={(e) => setField('desc', e.target.value)}
              rows={3}
              placeholder="Synopsis..."
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          {error && (
            <p className="sm:col-span-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Update Movie' : 'Add Movie'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {movies.map((m) => (
          <div
            key={m._id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0">
              {m.image ? (
                <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-slate-600">
                  <Film className="w-5 h-5" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{m.title}</h3>
              <p className="text-xs text-slate-400">
                {m.genre} · {m.duration}
              </p>
            </div>
            <button
              onClick={() => edit(m)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-sky-400 hover:bg-sky-500/15 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => remove(m._id)}
              disabled={deleting === m._id}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 text-rose-400 hover:bg-rose-500/15 disabled:opacity-50 transition-colors"
            >
              {deleting === m._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-400 mb-1.5">{label}</span>
      <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 transition-colors">
        <span className="text-slate-500">{icon}</span>
        {children}
      </div>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
      />
    </div>
  );
}
