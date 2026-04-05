import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle, Clock, ArrowRight, Inbox } from 'lucide-react';

const STATUS_STYLES = { pending:'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', accepted:'text-green-400 bg-green-500/10 border-green-500/20', rejected:'text-red-400 bg-red-500/10 border-red-500/20' };
const STATUS_ICONS  = { pending: Clock, accepted: CheckCircle, rejected: XCircle };

export default function RequestsPage() {
  const { currentUser, requests, getUserById, getListingById, respondRequest } = useApp();
  const [tab, setTab] = useState('incoming');
  const incoming     = requests.filter(r => r.sellerId === currentUser.id);
  const outgoing     = requests.filter(r => r.buyerId  === currentUser.id);
  const displayed    = tab === 'incoming' ? incoming : outgoing;
  const pendingCount = incoming.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="font-display text-5xl text-brand-light tracking-wide">REQUESTS</h1>
        <p className="text-brand-muted text-sm mt-1">Manage your incoming and outgoing requests</p>
      </div>
      <div className="flex gap-1 bg-brand-dark border border-brand-border p-1 rounded-xl mb-6 w-fit">
        {[{key:'incoming',label:'Incoming',count:pendingCount},{key:'outgoing',label:'Outgoing',count:null}].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-brand-secondary text-white shadow-red-sm' : 'text-brand-muted hover:text-brand-light'}`}>
            {t.label}
            {t.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? 'bg-white/20 text-white' : 'bg-brand-secondary text-white'}`}>{t.count}</span>}
          </button>
        ))}
      </div>
      {displayed.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-brand-border rounded-2xl">
          <Inbox size={32} className="mx-auto text-brand-muted mb-3" />
          <p className="text-brand-light font-semibold mb-1">No {tab} requests</p>
          <p className="text-brand-muted text-sm">{tab === 'incoming' ? 'Requests for your listings will appear here' : 'Browse the marketplace to request services'}</p>
          {tab === 'outgoing' && <Link to="/marketplace"><button className="btn-primary mt-4">Browse Marketplace</button></Link>}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayed.map(req => {
            const listing    = getListingById(req.listingId);
            const otherUser  = getUserById(tab === 'incoming' ? req.buyerId : req.sellerId);
            const StatusIcon = STATUS_ICONS[req.status];
            return (
              <div key={req.id} className="card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-secondary text-white text-sm font-bold flex items-center justify-center shrink-0">{otherUser?.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-brand-light font-semibold text-sm">{otherUser?.name}</p>
                        <span className="text-brand-muted text-xs">{otherUser?.college}</span>
                      </div>
                      <Link to={`/listing/${req.listingId}`} className="text-brand-secondary text-xs hover:underline flex items-center gap-1 mt-0.5">{listing?.title} <ArrowRight size={10} /></Link>
                      <p className="text-brand-muted text-xs mt-2 leading-relaxed bg-brand-surface p-2.5 rounded-xl border border-brand-border">"{req.message}"</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`badge border text-xs ${STATUS_STYLES[req.status]}`}><StatusIcon size={10} />{req.status}</span>
                        <span className="text-brand-muted text-xs">{req.createdAt}</span>
                        <span className="text-brand-secondary font-mono text-xs font-semibold">{listing?.credits} credits</span>
                      </div>
                    </div>
                  </div>
                  {tab === 'incoming' && req.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => respondRequest(req.id, true)} className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-green-500/20 transition-all"><CheckCircle size={13} />Accept</button>
                      <button onClick={() => respondRequest(req.id, false)} className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-red-500/20 transition-all"><XCircle size={13} />Decline</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
