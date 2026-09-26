import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TheatreCard from '../components/TheatreCard';
import { Spinner } from '../components/Loader';
import { Building2, Search, MapPin } from 'lucide-react';

const CITIES = ['All', 'Coimbatore', 'Chennai', 'Bangalore', 'Mumbai', 'Kochi'];

export default function TheatreListingPage() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await api.get('/theatres');
      if (res.data.success) {
        setTheatres(res.data.theatres);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTheatres = theatres.filter(t => {
    if (cityFilter !== 'All' && t.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
          <Building2 className="w-8 h-8 text-rose-500" />
          Partner Cinema Theatres
        </h1>
        <p className="text-slate-400 text-sm mt-1">Explore top multiplexes with IMAX, 4K Laser, and Dolby Atmos screens</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search theatre by name or locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* City */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1 sm:w-64">
          <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full py-1.5 cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-white">{c === 'All' ? 'All Cities' : c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredTheatres.length > 0 ? (
        <div className="space-y-6">
          {filteredTheatres.map(t => (
            <TheatreCard key={t.id} theatre={t} shows={[]} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Theatres Match Your Query</h3>
          <p className="text-sm text-slate-400">Try searching a different city or locality.</p>
        </div>
      )}

    </div>
  );
}
