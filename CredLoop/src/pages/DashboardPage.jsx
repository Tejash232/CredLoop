import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';
import { TrendingUp, Star, PlusCircle, ArrowRight, Zap } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const CAT_COLORS = {
  skills:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  rentals:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  services: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
  creative: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

export default function DashboardPage() {
  const { currentUser, listings, users, requests } = useApp();
  const myListings     = listings.filter(l => l.sellerId === currentUser.id);
  const recentListings = listings.slice(0, 6);
  const topUsers       = [...users].sort((a, b) => b.credits - a.credits).slice(0, 5);
  const myRequests     = requests.filter(r => r.buyerId === currentUser.id || r.sellerId === currentUser.id);
  const pendingCount   = requests.filter(r => r.sellerId === currentUser.id && r.status === 'pending').length;
  const recommended    = listings.filter(l => l.sellerId !== currentUser.id).slice(0, 3);

  const stats = [
    { label: 'Credits Balance', value: currentUser.credits,       unit: 'credits',                          color: 'text-brand-secondary', bg: 'bg-brand-secondary/10 border-brand-secondary/20' },
    { label: 'Listings',        value: myListings.length,         unit: 'active',                           color: 'text-blue-400',         bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Requests',        value: myRequests.length,         unit: 'total',                            color: 'text-purple-400',       bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Rating',          value: currentUser.rating || '—', unit: `(${currentUser.reviews} reviews)`, color: 'text-teal-400',         bg: 'bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden p-7 shadow-card" style={{background: 'linear-gradient(135deg, #1e0a4a 0%, #13131f 50%, #0d1a12 100%)'}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 70% 50%, rgba(108,60,220,0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(30,140,80,0.15) 0%, transparent 50%)'}} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 font-display text-[120px] text-white/5 select-none leading-none">CC</div>
        <div className="relative">
          <p className="text-brand-muted text-sm mb-1">Welcome back,</p>
          <h1 className="font-display text-5xl text-brand-light tracking-wide mb-1">{currentUser.name.toUpperCase()}</h1>
          <p className="text-brand-muted text-sm">{currentUser.college} · Joined {currentUser.joined}</p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link to="/create">
              <button className="btn-primary flex items-center gap-2"><PlusCircle size={15} />New Listing</button>
            </Link>
            <Link to="/marketplace">
              <button className="border border-white/20 text-brand-light px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all text-sm flex items-center gap-2">
                Browse Marketplace <ArrowRight size={14} />
              </button>
            </Link>
            {pendingCount > 0 && (
              <Link to="/requests">
                <button className="bg-white/10 border border-white/20 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                  <Zap size={14} className="text-brand-secondary" />{pendingCount} pending request{pendingCount > 1 ? 's' : ''}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`card border ${s.bg}`}>
            <p className="label">{s.label}</p>
            <p className={`font-mono text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-brand-muted text-xs mt-1">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div>
        <h2 className="font-display text-3xl text-brand-light tracking-wide mb-4">BROWSE BY CATEGORY</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/marketplace?category=${cat.id}`}>
              <div className={`card flex items-center gap-3 cursor-pointer hover:border-brand-secondary/40 border ${CAT_COLORS[cat.id]} transition-all`}>
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="text-brand-light font-medium text-sm">{cat.label}</p>
                  <p className="text-brand-muted text-xs">{listings.filter(l => l.category === cat.id).length} listings</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-3xl text-brand-light tracking-wide">RECENT LISTINGS</h2>
            <Link to="/marketplace" className="text-brand-secondary text-sm hover:underline flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-brand-secondary" />
              <h3 className="font-semibold text-brand-light text-sm">Top Students</h3>
            </div>
            <div className="flex flex-col gap-3">
              {topUsers.map((u, i) => (
                <Link key={u.id} to={`/profile/${u.id}`}>
                  <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <span className="text-brand-muted font-mono text-xs w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-xl bg-brand-secondary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-light text-xs font-medium truncate">{u.name}</p>
                      <p className="text-brand-muted text-[10px]">{u.college}</p>
                    </div>
                    <span className="text-brand-secondary font-mono text-xs font-semibold">{u.credits}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/leaderboard">
              <button className="w-full mt-4 text-brand-muted text-xs hover:text-brand-secondary transition-colors text-center">
                View full leaderboard →
              </button>
            </Link>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-brand-secondary" />
              <h3 className="font-semibold text-brand-light text-sm">Recommended For You</h3>
            </div>
            <div className="flex flex-col gap-3">
              {recommended.map(l => (
                <Link key={l.id} to={`/listing/${l.id}`}>
                  <div className="flex items-center gap-3 p-3 bg-brand-dark border border-brand-border rounded-xl hover:border-brand-secondary/40 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-xl shrink-0">
                      {{ skills:'🧠', rentals:'📦', services:'⚡', creative:'🎨' }[l.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-light text-xs font-medium truncate">{l.title}</p>
                      <p className="text-brand-muted text-[10px] mt-0.5">{l.category}</p>
                    </div>
                    <span className="text-brand-secondary font-mono text-xs shrink-0 font-semibold">{l.credits}cr</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
