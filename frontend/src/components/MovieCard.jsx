import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, Calendar } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function MovieCard({ movie }) {
  const { selectMovie } = useBooking();

  const isComingSoon = movie.status === 'COMING_SOON';

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col h-full border border-slate-800/80">
      
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700/50 flex items-center gap-1">
            {movie.language}
          </span>

          <span className="bg-rose-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-glow flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-white" />
            {movie.rating ? Number(movie.rating).toFixed(1) : '8.5'}
          </span>
        </div>

        {/* Status Tag */}
        {isComingSoon && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-amber-500/90 text-slate-950 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Calendar className="w-3.5 h-3.5" />
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-slate-900/60">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 mb-1">
            {movie.genre}
          </div>
          <h3 className="font-display font-bold text-lg text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{movie.duration} mins</span>
            </div>
            <span>•</span>
            <span className="truncate">{movie.director || 'Director'}</span>
          </div>
        </div>

        {/* Action CTA */}
        <div className="pt-2">
          {isComingSoon ? (
            <Link
              to={`/movies/${movie.id}`}
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl font-semibold text-xs transition"
            >
              <span>View Details</span>
            </Link>
          ) : (
            <Link
              to={`/movies/${movie.id}`}
              onClick={() => selectMovie(movie)}
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white py-2.5 rounded-xl font-bold text-xs shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}
