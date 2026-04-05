import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORY_EMOJIS = { skills: '🧠', rentals: '📦', services: '⚡', creative: '🎨' };
const CATEGORY_COLORS = {
  skills:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  rentals:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  services: 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20',
  creative: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
};
const CATEGORY_BG = {
  skills:   'from-purple-900/40 to-brand-surface',
  rentals:  'from-indigo-900/40 to-brand-surface',
  services: 'from-rose-900/30 to-brand-surface',
  creative: 'from-emerald-900/30 to-brand-surface',
};

export default function ListingCard({ listing }) {
  const { getUserById } = useApp();
  const seller   = getUserById(listing.sellerId);
  const catColor = CATEGORY_COLORS[listing.category] || '';
  const catBg    = CATEGORY_BG[listing.category] || 'from-brand-pale to-brand-dark';

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="card cursor-pointer group h-full flex flex-col">
        <div className={`w-full h-36 rounded-xl overflow-hidden relative mb-4 bg-gradient-to-br ${catBg}`}>
          {listing.image ? (
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">{CATEGORY_EMOJIS[listing.category]}</span>
            </div>
          )}
          <div className={`absolute top-2 right-2 badge border ${catColor} text-[10px]`}>
            {listing.category}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-brand-light text-sm leading-snug mb-1 group-hover:text-brand-secondary transition-colors line-clamp-2">
            {listing.title}
          </h3>
          <p className="text-brand-muted text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
            {listing.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-brand-muted border border-brand-border">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-brand-border">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-brand-secondary text-white text-[9px] font-bold flex items-center justify-center">
                {seller?.avatar}
              </div>
              <span className="text-brand-muted text-xs">{seller?.name?.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-3">
              {listing.reviews > 0 && (
                <div className="flex items-center gap-1 text-brand-secondary text-xs">
                  <Star size={10} fill="currentColor" />
                  <span className="font-mono">{listing.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-brand-secondary/10 text-brand-secondary font-mono font-semibold text-sm px-2.5 py-1 rounded-lg border border-brand-secondary/20">
                {listing.credits}
                <span className="text-[10px] text-brand-muted font-normal ml-0.5">cr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
