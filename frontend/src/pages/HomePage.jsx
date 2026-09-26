import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import TheatreCard from '../components/TheatreCard';
import { MovieSkeletonGrid } from '../components/Loader';
import { useBooking } from '../context/BookingContext';
import { Search, MapPin, Sparkles, ChevronRight, Flame, Film, ShieldCheck, Ticket, Play } from 'lucide-react';

export default function HomePage() {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { bookingState, selectCity } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movieRes, theatreRes] = await Promise.all([
        api.get('/movies'),
        api.get('/theatres')
      ]);

      if (movieRes.data.success) {
        const allMovies = movieRes.data.movies;
        setNowShowing(allMovies.filter(m => m.status === 'NOW_SHOWING'));
        setComingSoon(allMovies.filter(m => m.status === 'COMING_SOON'));
        // Popular sorted by rating
        setPopularMovies([...allMovies].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4));
      }

      if (theatreRes.data.success) {
        setTheatres(theatreRes.data.theatres.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner Section */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        
        {/* Backdrop Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1920&auto=format&fit=crop"
            alt="Cinema Backdrop"
            className="w-full h-full object-cover object-center opacity-20 filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-transparent to-[#0b0e14]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 py-16">
          
          <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 px-4 py-1.5 rounded-full text-rose-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-glow">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Next-Gen Cinema Booking Platform</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-tight">
            Book Your Ultimate <br />
            <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Movie Experience
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Reserve exact seats in advance for IMAX, 3D, and Dolby Atmos screens with instant QR tickets and zero hassle.
          </p>

          {/* Integrated Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
            <div className="glass-panel p-2.5 rounded-2xl flex flex-col sm:flex-row items-center gap-3 shadow-2xl border border-slate-700/60">
              
              <div className="flex-1 flex items-center space-x-3 px-3 w-full">
                <Search className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search movies, genres, actors, or theatres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                />
              </div>

              <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to="/movies"
              className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-slate-700/60 transition flex items-center gap-2"
            >
              <Film className="w-4 h-4 text-rose-500" />
              <span>Browse All Movies</span>
            </Link>
            <Link
              to="/theatres"
              className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/60 transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Find Theatres</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Main Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* NOW SHOWING SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">NOW SHOWING</h2>
                <p className="text-xs text-slate-400">Blockbuster movies running in theatres near you</p>
              </div>
            </div>

            <Link to="/movies" className="text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 group">
              <span>View All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <MovieSkeletonGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nowShowing.slice(0, 4).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* POPULAR MOVIES HORIZONTAL HIGHLIGHT */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-white">POPULAR MOVIES</h2>
              <p className="text-xs text-slate-400">Top customer rated films of the month</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularMovies.slice(0, 2).map(movie => (
              <div key={movie.id} className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row gap-5 border border-slate-800 hover:border-slate-700 transition">
                <div className="w-full sm:w-36 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                  <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                      {movie.genre}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white mt-1">{movie.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{movie.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-300">★ {movie.rating} Rating</span>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-glow"
                    >
                      Book Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED THEATRES */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-white">FEATURED THEATRES</h2>
              <p className="text-xs text-slate-400">Premium multiplex partners in {bookingState.city}</p>
            </div>
            <Link to="/theatres" className="text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {theatres.map(t => (
              <TheatreCard key={t.id} theatre={t} shows={[]} />
            ))}
          </div>
        </section>

        {/* COMING SOON SECTION */}
        {comingSoon.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-white">COMING SOON</h2>
                <p className="text-xs text-slate-400">Get ready for upcoming cinema premieres</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {comingSoon.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
