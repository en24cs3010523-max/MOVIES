import { Film, Home, LayoutDashboard, Shield, LogIn, LogOut, UserCircle } from 'lucide-react';
import type { User, View } from '../types';

interface NavbarProps {
  view: View;
  setView: (v: View) => void;
  user: User | null;
  onLogout: () => void;
}

export function Navbar({ view, setView, user, onLogout }: NavbarProps) {
  const navItem = (v: View, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setView(v)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        view === v ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => setView('home')} className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center shadow-lg shadow-emerald-500/20">
            <Film className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            IMovies
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {navItem('home', 'Home', <Home className="w-4 h-4" />)}
          {user && navItem('dashboard', 'My Tickets', <LayoutDashboard className="w-4 h-4" />)}
          {navItem('admin', 'Admin', <Shield className="w-4 h-4" />)}
        </nav>

        {user ? (
          <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70">
              <UserCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-200 hidden sm:inline">{user.name}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-rose-500/15 hover:text-rose-400 transition-colors"
          >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
          </button>
          </div>
        ) : (
          <button
            onClick={() => setView('auth')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
