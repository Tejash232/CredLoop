import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShoppingBag, PlusCircle, Bell, Trophy, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { to: '/',            label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/requests',    label: 'Requests',    icon: Bell },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export default function Navbar() {
  const { currentUser, logout, requests } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const pendingCount = requests.filter(r => r.sellerId === currentUser?.id && r.status === 'pending').length;
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-brand-border shadow-card" style={{background: "rgba(13,13,20,0.85)"}}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-secondary rounded-xl flex items-center justify-center red-glow">
            <span className="font-display text-white text-lg leading-none">CL</span>
          </div>
          <span className="font-display text-2xl tracking-wide"><span className="text-brand-light">CRED</span><span className="text-brand-secondary">looP</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
                  active ? 'bg-brand-secondary text-white shadow-red-sm' : 'text-brand-muted hover:text-brand-light hover:bg-white/5'
                }`}>
                <Icon size={15} />
                {label}
                {label === 'Requests' && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-light text-brand-black text-[9px] flex items-center justify-center font-bold rounded-full">{pendingCount}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/create">
            <button className="btn-primary flex items-center gap-2">
              <PlusCircle size={15} />New Listing
            </button>
          </Link>
          <div className="flex items-center gap-2 bg-brand-secondary/10 border border-brand-secondary/20 px-3 py-1.5 rounded-xl">
            <span className="text-brand-secondary text-sm font-mono font-semibold">{currentUser?.credits}</span>
            <span className="text-brand-muted text-xs">credits</span>
          </div>
          <Link to={`/profile/${currentUser?.id}`}>
            <div className="w-8 h-8 rounded-xl bg-brand-secondary text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-red-500 transition-all">
              {currentUser?.avatar}
            </div>
          </Link>
          <button onClick={handleLogout} className="text-brand-muted hover:text-brand-secondary transition-colors p-1">
            <LogOut size={16} />
          </button>
        </div>

        <button className="md:hidden text-brand-light p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-brand-border bg-brand-dark px-4 pb-4 pt-2 flex flex-col gap-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to ? 'bg-brand-secondary text-white' : 'text-brand-muted hover:text-brand-light hover:bg-white/5'
              }`}>
              <Icon size={16} />{label}
            </Link>
          ))}
          <Link to="/create" onClick={() => setOpen(false)}>
            <button className="btn-primary w-full flex items-center justify-center gap-2 mt-1">
              <PlusCircle size={15} />New Listing
            </button>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-brand-secondary text-sm px-4 py-2">
            <LogOut size={15} />Logout
          </button>
        </div>
      )}
    </nav>
  );
}
