import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const CAT_COLORS = {
  skills:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  rentals:  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  services: 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20',
  creative: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
};
const CAT_EMOJI = { skills:'🧠', rentals:'📦', services:'⚡', creative:'🎨' };
const CAT_BG    = { skills:'from-blue-500/10 to-brand-primary/20', rentals:'from-purple-500/10 to-brand-dark', services:'from-brand-secondary/10 to-brand-dark', creative:'from-teal-500/10 to-brand-dark' };

export default function ListingDetailPage() {
  const { id } = useParams();
  const { getListingById, getUserById, currentUser, sendRequest, requests, addReview, showNotif } = useApp();
  const listing = getListingById(id);
  const [message, setMessage]               = useState('');
  const [showReview, setShowReview]         = useState(false);
  const [hoverRating, setHoverRating]       = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showModal, setShowModal]           = useState(false);

  if (!listing) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-brand-light font-semibold mb-2">Listing not found</p>
      <Link to="/marketplace" className="text-brand-secondary text-sm hover:underline">← Back to Marketplace</Link>
    </div>
  );

  const seller           = getUserById(listing.sellerId);
  const isOwner          = currentUser.id === listing.sellerId;
  const alreadyRequested = requests.some(r => r.listingId === id && r.buyerId === currentUser.id);
  const canAfford        = currentUser.credits >= listing.credits;

  const handleRequest = () => {
    if (!message.trim()) { showNotif('Please add a message', 'error'); return; }
    sendRequest(id, message);
    setMessage('');
    setShowModal(false);
  };
  const handleReview = () => {
    if (!selectedRating) { showNotif('Select a rating', 'error'); return; }
    addReview(id, selectedRating);
    setShowReview(false);
    setSelectedRating(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-light text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />Back to Marketplace
      </Link>
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className={`w-full aspect-video rounded-2xl relative overflow-hidden bg-gradient-to-br ${CAT_BG[listing.category]}`}>
            {listing.image ? (
              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-9xl opacity-20">{CAT_EMOJI[listing.category]}</span>
              </div>
            )}
            <div className={`absolute top-4 left-4 badge border ${CAT_COLORS[listing.category]}`}>{listing.category}</div>
          </div>
          <div>
            <h1 className="font-display text-4xl text-brand-light tracking-wide mb-3">{listing.title.toUpperCase()}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.tags.map(tag => (
                <span key={tag} className="badge bg-white/5 border border-brand-border text-brand-muted">{tag}</span>
              ))}
            </div>
            <p className="text-brand-muted leading-relaxed">{listing.description}</p>
          </div>
          {listing.reviews > 0 && (
            <div className="card border-brand-secondary/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} className={i <= Math.round(listing.rating) ? 'text-brand-secondary' : 'text-brand-border'} fill={i <= Math.round(listing.rating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-brand-light font-semibold">{listing.rating}</span>
                <span className="text-brand-muted text-sm">({listing.reviews} reviews)</span>
              </div>
            </div>
          )}
          {!isOwner && (
            <div>
              {!showReview ? (
                <button onClick={() => setShowReview(true)} className="btn-ghost text-sm">Leave a Review</button>
              ) : (
                <div className="card space-y-3">
                  <p className="text-brand-light text-sm font-medium">Rate this listing</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)} onClick={() => setSelectedRating(i)}>
                        <Star size={24} className={i <= (hoverRating || selectedRating) ? 'text-brand-secondary' : 'text-brand-border'} fill={i <= (hoverRating || selectedRating) ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleReview} className="btn-primary text-sm">Submit</button>
                    <button onClick={() => setShowReview(false)} className="btn-ghost text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="card border-brand-secondary/20 shadow-red">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-mono font-bold text-4xl text-brand-secondary">{listing.credits}</span>
              <span className="text-brand-muted">credits</span>
            </div>
            {isOwner ? (
              <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle size={15} />Your listing</div>
            ) : alreadyRequested ? (
              <div className="flex items-center gap-2 text-brand-secondary text-sm"><CheckCircle size={15} />Request sent</div>
            ) : (
              <div className="space-y-3">
                <div className={`text-xs p-2 rounded-xl border ${canAfford ? 'border-green-500/20 bg-green-500/5 text-green-400' : 'border-red-500/20 bg-red-500/5 text-red-400'}`}>
                  Your balance: <span className="font-mono font-semibold">{currentUser.credits} credits</span>
                  {!canAfford && ' (insufficient)'}
                </div>
                <button onClick={() => setShowModal(true)} disabled={!canAfford}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={14} />Send Request
                </button>
              </div>
            )}
          </div>
          <div className="card">
            <p className="label mb-3">Offered By</p>
            <Link to={`/profile/${seller?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-xl bg-brand-secondary text-white text-base font-bold flex items-center justify-center">{seller?.avatar}</div>
              <div>
                <p className="text-brand-light font-semibold text-sm">{seller?.name}</p>
                <p className="text-brand-muted text-xs">{seller?.college}</p>
                {seller?.rating > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="text-brand-secondary" fill="currentColor" />
                    <span className="text-brand-muted text-[10px]">{seller.rating} ({seller.reviews})</span>
                  </div>
                )}
              </div>
            </Link>
            {seller?.bio && <p className="text-brand-muted text-xs mt-3 leading-relaxed">{seller.bio}</p>}
          </div>
          <div className="text-brand-muted text-xs px-1">
            Listed on {new Date(listing.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-brand-dark border border-brand-border rounded-2xl p-6 w-full max-w-md shadow-card-lg" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-2xl text-brand-light tracking-wide mb-1">SEND REQUEST</h3>
            <p className="text-brand-muted text-sm mb-4">{listing.title}</p>
            <label className="label">Your message</label>
            <textarea className="input h-28 resize-none" placeholder="Introduce yourself and explain what you need..." value={message} onChange={e => setMessage(e.target.value)} />
            <p className="text-brand-muted text-xs mt-2 mb-4">
              This will reserve <span className="text-brand-secondary font-mono">{listing.credits} credits</span> upon acceptance.
            </p>
            <div className="flex gap-3">
              <button onClick={handleRequest} className="btn-primary flex-1 flex items-center justify-center gap-2"><Send size={14} />Send Request</button>
              <button onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
