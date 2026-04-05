import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';
import { Star, MapPin, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const { getUserById, listings, currentUser } = useApp();
  const user = getUserById(id);
  if (!user) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-5xl mb-4">👤</p><p className="text-brand-light font-semibold">User not found</p></div>;
  const userListings = listings.filter(l => l.sellerId === user.id);
  const isMe = user.id === currentUser.id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl overflow-hidden p-7 mb-8 shadow-card" style={{background:'linear-gradient(135deg, #1e0a4a 0%, #13131f 50%, #0d1a12 100%)'}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 80% 50%, rgba(108,60,220,0.25) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(30,140,80,0.15) 0%, transparent 50%)'}} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-secondary text-white text-2xl font-bold flex items-center justify-center red-glow shrink-0">{user.avatar}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-4xl text-brand-light tracking-wide">{user.name.toUpperCase()}</h1>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-brand-muted text-sm"><MapPin size={12} />{user.college}</span>
                  <span className="flex items-center gap-1 text-brand-muted text-sm"><Calendar size={12} />Joined {user.joined}</span>
                  {user.rating > 0 && <span className="flex items-center gap-1 text-brand-secondary text-sm"><Star size={12} fill="currentColor" />{user.rating} ({user.reviews} reviews)</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-brand-secondary/10 border border-brand-secondary/20 px-4 py-2 rounded-xl">
                <span className="text-brand-secondary font-mono font-bold text-2xl">{user.credits}</span>
                <span className="text-brand-muted text-sm">credits</span>
              </div>
            </div>
            {user.bio && <p className="text-brand-muted text-sm mt-3 max-w-lg">{user.bio}</p>}
            {user.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {user.skills.map(s => <span key={s} className="badge bg-white/10 border border-white/20 text-brand-light text-xs">{s}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-display text-3xl text-brand-light tracking-wide mb-4">
          {isMe ? 'MY LISTINGS' : `${user.name.split(' ')[0].toUpperCase()}'S LISTINGS`}
        </h2>
        {userListings.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-brand-border rounded-2xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-brand-muted text-sm">No listings yet</p>
            {isMe && <Link to="/create"><button className="btn-primary mt-4">Create your first listing</button></Link>}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}
