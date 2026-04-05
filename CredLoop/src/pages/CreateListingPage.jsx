import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Upload, PlusCircle, X, ImageIcon } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function CreateListingPage() {
  const { addListing, currentUser } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title:'', category:'skills', description:'', credits:'', tags:'' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64]   = useState(null);
  const [dragOver, setDragOver]         = useState(false);
  const [loading, setLoading]           = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
    if (file.size > 5*1024*1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => { setImagePreview(e.target.result); setImageBase64(e.target.result); };
    reader.readAsDataURL(file);
  };
  const handleFileChange = (e) => processImageFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processImageFile(e.dataTransfer.files[0]); };
  const removeImage = (e) => { e.stopPropagation(); setImagePreview(null); setImageBase64(null); if (fileInputRef.current) fileInputRef.current.value=''; };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title||!form.description||!form.credits) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const listing = addListing({ ...form, credits:parseInt(form.credits), tags:form.tags.split(',').map(t=>t.trim()).filter(Boolean), image:imageBase64||null });
    setLoading(false);
    navigate(`/listing/${listing.id}`);
  };
  const CAT_EMOJI = { skills:'🧠', rentals:'📦', services:'⚡', creative:'🎨' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-light text-sm mb-6 transition-colors">
        <ArrowLeft size={15} />Back to Dashboard
      </Link>
      <div className="mb-7">
        <h1 className="font-display text-5xl text-brand-light tracking-wide">CREATE LISTING</h1>
        <p className="text-brand-muted text-sm mt-1">Share your skills, items, or services with the campus</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button type="button" key={cat.id} onClick={() => setForm(f=>({...f,category:cat.id}))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-sm font-medium ${form.category===cat.id?'border-brand-secondary bg-brand-secondary/10 text-brand-secondary shadow-red-sm':'border-brand-border text-brand-muted hover:border-brand-secondary/40 hover:text-brand-light'}`}>
                <span className="text-2xl">{CAT_EMOJI[cat.id]}</span>{cat.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Listing Title</label>
          <input className="input" name="title" placeholder="e.g. React.js Crash Course — 3 Sessions" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input h-32 resize-none" name="description" placeholder="Describe what you're offering..." value={form.description} onChange={handleChange} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Credits Price</label>
            <div className="relative">
              <input className="input pr-16" name="credits" type="number" min="1" max="500" placeholder="50" value={form.credits} onChange={handleChange} required />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondary text-xs font-mono font-semibold">credits</span>
            </div>
            <p className="text-brand-muted text-xs mt-1.5">Your balance: <span className="text-brand-secondary font-mono">{currentUser.credits}</span> credits</p>
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input className="input" name="tags" placeholder="React, Frontend, Beginner" value={form.tags} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="label">Cover Image (optional)</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-brand-secondary/30 group">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-brand-dark text-brand-light text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-surface transition-all flex items-center gap-1.5"><ImageIcon size={12} />Change</button>
                <button type="button" onClick={removeImage} className="bg-brand-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500 transition-all flex items-center gap-1.5"><X size={12} />Remove</button>
              </div>
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-brand-secondary text-white rounded-full flex items-center justify-center transition-colors"><X size={14} /></button>
            </div>
          ) : (
            <label htmlFor="image-upload" onDrop={handleDrop} onDragOver={(e)=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragOver?'border-brand-secondary bg-brand-secondary/10':'border-brand-border hover:border-brand-secondary/50 hover:bg-white/5'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${dragOver?'bg-brand-secondary/20':'bg-brand-surface'}`}>
                <Upload size={22} className={dragOver?'text-brand-secondary':'text-brand-muted'} />
              </div>
              <p className="text-brand-light text-sm font-medium mb-1">{dragOver?'Drop image here':'Click to upload or drag & drop'}</p>
              <p className="text-brand-muted text-xs">PNG, JPG, GIF, WebP — max 5MB</p>
            </label>
          )}
        </div>
        {form.title && (
          <div className="border border-brand-secondary/20 rounded-xl overflow-hidden bg-brand-secondary/5">
            <p className="text-brand-secondary text-xs font-semibold px-4 pt-3 pb-2 uppercase tracking-wider border-b border-brand-secondary/10">Preview</p>
            {imagePreview && <img src={imagePreview} alt="cover" className="w-full h-32 object-cover" />}
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="text-brand-light font-semibold text-sm">{form.title}</p>
                <p className="text-brand-muted text-xs mt-1 line-clamp-2">{form.description||'No description yet'}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.tags.split(',').filter(t=>t.trim()).map(tag=>(
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-brand-muted border border-brand-border">{tag.trim()}</span>
                  ))}
                </div>
              </div>
              {form.credits && (
                <div className="bg-brand-secondary/10 text-brand-secondary font-mono font-bold text-lg px-3 py-1.5 rounded-xl border border-brand-secondary/20 shrink-0">
                  {form.credits}<span className="text-xs font-normal ml-0.5">cr</span>
                </div>
              )}
            </div>
          </div>
        )}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
              </svg>Publishing...
            </span>
          ) : <><PlusCircle size={17} />Publish Listing</>}
        </button>
      </form>
    </div>
  );
}
