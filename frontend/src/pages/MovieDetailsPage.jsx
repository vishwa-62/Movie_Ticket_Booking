import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import TheatreCard from '../components/TheatreCard';
import { Spinner } from '../components/Loader';
import { Star, Clock, Calendar, Play, MapPin, User, ChevronRight, Check } from 'lucide-react';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookingState, selectMovie, selectShowDate } = useBooking();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(bookingState.showDate || new Date().toISOString().split('T')[0]);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Generate 5 consecutive dates starting today
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'TODAY' : i === 1 ? 'TOMORROW' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return { dateStr, dayName, dayNumber, monthName };
  });

  useEffect(() => {
    fetchMovieDetails();
  }, [id, selectedDate]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const [mRes, sRes, tRes] = await Promise.all([
        api.get(`/movies/${id}`),
        api.get(`/shows?movie_id=${id}&date=${selectedDate}`),
        api.get('/theatres')
      ]);

      if (mRes.data.success) {
        setMovie(mRes.data.movie);
        selectMovie(mRes.data.movie);
      }

      if (sRes.data.success) {
        setShows(sRes.data.shows);
      }

      if (tRes.data.success) {
        setTheatres(tRes.data.theatres);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dateStr) => {
    setSelectedDate(dateStr);
    selectShowDate(dateStr);
  };

  if (loading || !movie) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Group shows by theatre
  const theatreShowsMap = {};
  theatres.forEach(t => {
    theatreShowsMap[t.id] = shows.filter(s => s.theatre_id === t.id);
  });

  return (
    <div className="space-y-12 pb-20">
      
      {/* Movie Banner Backdrop Section */}
      <div className="relative min-h-[460px] bg-slate-950 flex items-end overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.banner || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover filter blur-sm opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            
            {/* Poster Card */}
            <div className="w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/60 flex-shrink-0 bg-slate-900">
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Info Column */}
            <div className="flex-1 text-center md:text-left space-y-4">
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold">
                <span className="bg-rose-600 text-white px-3 py-1 rounded-md shadow-glow">
                  {movie.language}
                </span>
                <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-md border border-slate-700">
                  {movie.genre}
                </span>
                <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-md border border-amber-500/30 flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}/10
                </span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-500" />
                  <span>{movie.duration} Mins</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>Release: {new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {movie.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block font-bold">Director</span>
                  <span className="text-slate-200 font-semibold">{movie.director}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block font-bold">Cast</span>
                  <span className="text-slate-200 font-semibold">{movie.cast}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Booking Selection Flow Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Step 1: Date Selection */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              <span>Select Date</span>
            </h3>
            <span className="text-xs text-slate-400">Showing available showtimes</span>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {dateOptions.map(opt => {
              const active = selectedDate === opt.dateStr;
              return (
                <button
                  key={opt.dateStr}
                  onClick={() => handleDateChange(opt.dateStr)}
                  className={`flex flex-col items-center justify-center min-w-[90px] py-3.5 px-4 rounded-xl border transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-to-b from-rose-600 to-rose-700 text-white border-rose-500 shadow-glow scale-105' 
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">{opt.dayName}</span>
                  <span className="text-2xl font-extrabold font-display my-0.5">{opt.dayNumber}</span>
                  <span className="text-[10px] font-semibold">{opt.monthName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Theatre and Show Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-500" />
              <span>Select Theatre & Show Time</span>
            </h3>
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              City: {bookingState.city}
            </span>
          </div>

          {theatres.length > 0 ? (
            <div className="space-y-6">
              {theatres.map(theatre => (
                <TheatreCard
                  key={theatre.id}
                  theatre={theatre}
                  shows={theatreShowsMap[theatre.id] || []}
                  movie={movie}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl text-slate-400">
              No theatres available in {bookingState.city} for this date.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
