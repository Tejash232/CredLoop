import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ListingCard from '../components/ListingCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function MarketplacePage() {
  const { listings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const activeCategory = searchParams.get('category') || 'all';
  const setCategory = (cat) => { if (cat === 'all') setSearchParams({}); else setSearchParams({ category: cat }); };

  const filtered = useMemo(() => {
    let res = [...listings];
    if (activeCategory !== 'all') res = res.filter(l => l.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (sortBy === 'newest')     res.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sortBy === 'price_asc')  res.sort((a, b) => a.credits - b.credits);
    if (sortBy === 'price_desc') res.sort((a, b) => b.credits - a.credits);
    if (sortBy === 'rating')     res.sort((a, b) => b.rating - a.rating);
    return res;
  }, [listings, activeCategory, search, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="font-display text-5xl text-brand-light tracking-wide mb-1">MARKETPLACE</h1>
        <p className="text-brand-muted text-sm">{listings.length} listings available on campus</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input className="input pl-9" placeholder="Search skills, items, services..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-light"><X size={14} /></button>}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-brand-muted shrink-0" />
          <select className="input w-auto" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeCategory === 'all' ? 'bg-brand-secondary text-white border-brand-secondary shadow-red-sm' : 'border-brand-border text-brand-muted hover:border-brand-secondary/50 hover:text-brand-light'}`}>
          All ({listings.length})
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeCategory === cat.id ? 'bg-brand-secondary text-white border-brand-secondary shadow-red-sm' : 'border-brand-border text-brand-muted hover:border-brand-secondary/50 hover:text-brand-light'}`}>
            {cat.icon} {cat.label} ({listings.filter(l => l.category === cat.id).length})
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-brand-light font-semibold mb-1">No listings found</p>
          <p className="text-brand-muted text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
