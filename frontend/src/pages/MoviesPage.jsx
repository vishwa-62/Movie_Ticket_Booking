import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { MovieSkeletonGrid } from '../components/Loader';
import { Search, Filter, Film } from 'lucide-react';

const GENRES = ['All', 'Action/Sci-Fi', 'Sci-Fi/Drama', 'Action/Thriller', 'Action/Crime', 'Action/Comedy', 'Fantasy/Action', 'Action/Drama'];
const LANGUAGES = ['All', 'English', 'Tamil', 'Hindi', 'Telugu'];

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'NOW_SHOWING');

  useEffect(() => {
    fetchMovies();
  }, [selectedStatus]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/movies');
      if (res.data.success) {
        setMovies(res.data.movies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie => {
    if (selectedStatus !== 'ALL' && movie.status !== selectedStatus) return false;
    if (selectedGenre !== 'All' && !movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return false;
    if (selectedLanguage !== 'All' && movie.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchCast = movie.cast?.toLowerCase().includes(q);
      const matchDirector = movie.director?.toLowerCase().includes(q);
      if (!matchTitle && !matchCast && !matchDirector) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
            <Film className="w-8 h-8 text-rose-500" />
            Explore Movies
          </h1>
          <p className="text-slate-400 text-sm mt-1">Discover now showing & upcoming releases in your city</p>
        </div>

        {/* Status Toggle Pills */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setSelectedStatus('NOW_SHOWING')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedStatus === 'NOW_SHOWING' ? 'bg-rose-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setSelectedStatus('COMING_SOON')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedStatus === 'COMING_SOON' ? 'bg-rose-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Coming Soon
          </button>
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedStatus === 'ALL' ? 'bg-rose-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Films
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search movie title or cast..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1">
          <Filter className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full py-1.5 cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-white">All Genres</option>
            {GENRES.slice(1).map(g => (
              <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-1">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full py-1.5 cursor-pointer"
          >
            <option value="All" className="bg-slate-900 text-white">All Languages</option>
            {LANGUAGES.slice(1).map(l => (
              <option key={l} value={l} className="bg-slate-900 text-white">{l}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => { setSearch(''); setSelectedGenre('All'); setSelectedLanguage('All'); setSelectedStatus('NOW_SHOWING'); }}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
        >
          Reset Filters
        </button>

      </div>

      {/* Movies Grid */}
      {loading ? (
        <MovieSkeletonGrid count={8} />
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Movies Found</h3>
          <p className="text-sm text-slate-400">Try loosening your search query or reset genre and language filters.</p>
        </div>
      )}

    </div>
  );
}
