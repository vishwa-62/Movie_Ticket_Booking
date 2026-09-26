import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { Film, MapPin, Calendar, Clock, Ticket, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function BookingSummaryPage() {
  const { bookingState, getSubtotal, getConvenienceFee, getTotalAmount } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { movie, theatre, show, selectedSeats } = bookingState;

  if (!movie || !show || selectedSeats.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Film className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">No Active Booking Selection</h2>
        <p className="text-sm text-slate-400">Please choose a movie and select seats first.</p>
        <Link to="/movies" className="inline-block px-6 py-2.5 bg-rose-600 text-white rounded-xl font-semibold">
          Browse Movies
        </Link>
      </div>
    );
  }

  const handlePaymentProceed = () => {
    if (!user) {
      navigate('/login', { state: { from: '/payment' } });
    } else {
      navigate('/payment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Seat Selection</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Step 6 of 9 • Review Booking</span>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie Poster */}
          <div className="w-36 h-52 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-800 mx-auto md:mx-0">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">{movie.title}</h1>
            <p className="text-xs text-rose-400 font-semibold">{movie.language} • {movie.genre} • {movie.duration} Mins</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>{theatre?.name || show.theatre_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>{show.show_date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>{show.show_time} ({show.screen_name || 'Screen 1'})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Ticket className="w-4 h-4 text-rose-500" />
                <span>Seats: <strong className="text-white">{selectedSeats.map(s => s.seat_number).join(', ')}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Breakdown</h3>

          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Seats Price ({selectedSeats.length} Seats)</span>
              <span className="font-semibold text-white">₹{getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Convenience Fee</span>
              <span className="font-semibold text-white">₹{getConvenienceFee().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-extrabold text-white pt-3 border-t border-slate-800">
              <span>Total Payable Amount</span>
              <span className="text-rose-500 font-display text-2xl">₹{getTotalAmount().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handlePaymentProceed}
            className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-base rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Proceed to Payment (₹{getTotalAmount().toFixed(2)})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
}
