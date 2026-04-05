import { CheckCircle, XCircle } from 'lucide-react';
export default function Notification({ msg, type }) {
  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-card-lg border text-sm font-medium animate-fade-up
      ${type === 'error'
        ? 'bg-brand-dark border-red-500/30 text-red-400'
        : 'bg-brand-dark border-brand-secondary/30 text-brand-light'}`}>
      {type === 'error' ? <XCircle size={16} className="text-red-400" /> : <CheckCircle size={16} className="text-brand-secondary" />}
      {msg}
    </div>
  );
}
