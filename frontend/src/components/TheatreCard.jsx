import React from 'react';
import { MapPin, Tv, Clock, ChevronRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

export default function TheatreCard({ theatre, shows = [], movie = null }) {
  const { selectTheatreAndShow } = useBooking();
  const navigate = useNavigate();

  const handleSelectShow = (show) => {
    selectTheatreAndShow(theatre, show);
    if (movie) {
      navigate(`/seats?showId=${show.id}`);
    }
  };

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
            {theatre.name}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {theatre.city}
            </span>
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span>{theatre.address}, {theatre.location}</span>
          </p>
        </div>
      </div>

      {/* Available Shows */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>Available Show Timings</span>
        </div>

        {shows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {shows.map(show => (
              <button
                key={show.id}
                onClick={() => handleSelectShow(show)}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 hover:bg-rose-500/10 transition-all duration-300"
              >
                <span className="text-sm font-extrabold text-white group-hover:text-rose-400">
                  {show.show_time}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {show.screen_name || 'Screen 1'}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 mt-1">
                  ₹{Number(show.ticket_price).toFixed(0)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/50 rounded-xl p-4 text-center text-slate-500 text-xs">
            No active showtimes scheduled for this date.
          </div>
        )}
      </div>
    </div>
  );
}
