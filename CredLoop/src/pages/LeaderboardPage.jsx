import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TrendingUp, Star } from 'lucide-react';

export default function LeaderboardPage() {
  const { users, listings, currentUser } = useApp();
  const ranked = [...users].map(u => ({ ...u, listingCount: listings.filter(l => l.sellerId === u.id).length })).sort((a, b) => b.credits - a.credits);
  const myRank = ranked.findIndex(u => u.id === currentUser.id) + 1;

  const PODIUM = [
    { bg: 'bg-brand-dark border-blue-500/30',           avatar: 'bg-blue-500/20 text-blue-400',     credit: 'text-blue-400',         medal: '🥈', h: 'py-5' },
    { bg: 'bg-brand-primary/30 border-brand-secondary', avatar: 'bg-brand-secondary text-white',    credit: 'text-brand-secondary',  medal: '🥇', h: 'py-8' },
    { bg: 'bg-brand-dark border-purple-500/30',         avatar: 'bg-purple-500/20 text-purple-400', credit: 'text-purple-400',       medal: '🥉', h: 'py-5' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="font-display text-5xl text-brand-light tracking-wide">LEADERBOARD</h1>
        <p className="text-brand-muted text-sm mt-1">Top students ranked by CredlooP earned</p>
      </div>

      <div className="card border-brand-secondary/20 bg-brand-secondary/5 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-secondary text-white text-sm font-bold flex items-center justify-center">{currentUser.avatar}</div>
            <div>
              <p className="text-brand-light font-semibold text-sm">Your Ranking</p>
              <p className="text-brand-muted text-xs">{currentUser.college}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-4xl text-brand-secondary">#{myRank}</p>
            <p className="text-brand-muted text-xs">{currentUser.credits} credits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[ranked[1], ranked[0], ranked[2]].map((u, podiumIdx) => {
          if (!u) return <div key={podiumIdx} />;
          const s = PODIUM[podiumIdx];
          return (
            <Link key={u.id} to={`/profile/${u.id}`}>
              <div className={`card flex flex-col items-center text-center border ${s.bg} ${s.h} cursor-pointer hover:scale-105 transition-all`}>
                <div className={`w-12 h-12 rounded-xl ${s.avatar} text-sm font-bold flex items-center justify-center mb-2`}>{u.avatar}</div>
                <p className="text-brand-light text-xs font-semibold truncate w-full px-1">{u.name.split(' ')[0]}</p>
                <p className={`font-mono font-bold text-xl mt-1 ${s.credit}`}>{u.credits}</p>
                <p className="text-brand-muted text-[10px]">credits</p>
                <div className="mt-2 text-2xl">{s.medal}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-brand-dark border border-brand-border rounded-2xl overflow-hidden shadow-card">
        <div className="px-5 py-4 border-b border-brand-border bg-brand-surface">
          <h3 className="font-semibold text-brand-light text-sm flex items-center gap-2">
            <TrendingUp size={15} className="text-brand-secondary" />Full Rankings
          </h3>
        </div>
        <div className="divide-y divide-brand-border">
          {ranked.map((u, i) => {
            const isMe = u.id === currentUser.id;
            const rank = i + 1;
            return (
              <Link key={u.id} to={`/profile/${u.id}`}>
                <div className={`flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors ${isMe ? 'bg-brand-secondary/5' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${rank===1?'bg-brand-secondary text-white':rank===2?'bg-blue-500/20 text-blue-400':rank===3?'bg-purple-500/20 text-purple-400':'bg-brand-surface text-brand-muted'}`}>
                    {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
                  </div>
                  <div className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${isMe?'bg-brand-secondary text-white':'bg-brand-surface text-brand-muted border border-brand-border'}`}>{u.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isMe?'text-brand-secondary':'text-brand-light'}`}>
                      {u.name} {isMe && <span className="text-brand-muted text-xs font-normal">(you)</span>}
                    </p>
                    <p className="text-brand-muted text-[10px]">{u.college} · {u.listingCount} listings</p>
                  </div>
                  {u.rating > 0 && <div className="flex items-center gap-1 text-brand-secondary text-xs shrink-0"><Star size={10} fill="currentColor" />{u.rating}</div>}
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-brand-secondary text-sm">{u.credits}</p>
                    <p className="text-brand-muted text-[10px]">credits</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
