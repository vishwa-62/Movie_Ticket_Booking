import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Spinner } from '../components/Loader';
import Toast from '../components/Toast';
import { Tv, Ticket, ArrowRight, ShieldAlert, Info, ArrowLeft } from 'lucide-react';

export default function SeatSelectionPage() {
  const [searchParams] = useSearchParams();
  const showId = searchParams.get('showId');
  const navigate = useNavigate();
  const { bookingState, toggleSeat, getSubtotal, getConvenienceFee, getTotalAmount } = useBooking();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (!showId) {
      navigate('/movies');
      return;
    }
    fetchShowData();
  }, [showId]);

  const fetchShowData = async () => {
    try {
      setLoading(true);
      const [showRes, seatRes] = await Promise.all([
        api.get(`/shows/${showId}`),
        api.get(`/shows/${showId}/seats`)
      ]);

      if (showRes.data.success) {
        setShow(showRes.data.show);
      }
      if (seatRes.data.success) {
        setSeats(seatRes.data.seats);
      }
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to load show details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !show) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Group seats by rowName
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const seatsByRow = {};
  rows.forEach(r => {
    seatsByRow[r] = seats.filter(s => s.row_name === r);
  });

  const selectedSeatIds = new Set(bookingState.selectedSeats.map(s => s.id));

  const handleSeatClick = (seat) => {
    if (seat.isBooked) {
      setToastMsg(`Seat ${seat.seat_number} is already booked by another customer.`);
      return;
    }
    toggleSeat(seat);
  };

  const handleProceed = () => {
    if (bookingState.selectedSeats.length === 0) {
      setToastMsg('Please select at least 1 seat to proceed.');
      return;
    }
    navigate('/booking-summary');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Showtimes</span>
        </button>

        <div className="text-center sm:text-right">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white">
            {show.movie_title}
          </h1>
          <p className="text-xs text-slate-400">
            {show.theatre_name} • {show.screen_name} • {show.show_date} ({show.show_time})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Cinema Seat Grid (Left Col) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-10 flex flex-col items-center">
          
          {/* Cinema Screen Banner */}
          <div className="w-full max-w-xl space-y-2 text-center">
            <div className="cinema-screen-curve" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block pt-1">
              ALL EYES THIS WAY • SCREEN
            </span>
          </div>

          {/* Seat Layout Matrix */}
          <div className="w-full max-w-2xl space-y-3 pt-4 overflow-x-auto pb-4">
            {rows.map(rowName => (
              <div key={rowName} className="flex items-center justify-center space-x-2 sm:space-x-3">
                
                {/* Row Label Left */}
                <span className="w-6 text-center text-xs font-bold text-slate-400">{rowName}</span>

                {/* Seats */}
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {seatsByRow[rowName]?.map(seat => {
                    const isSelected = selectedSeatIds.has(seat.id);
                    const isBooked = seat.isBooked;

                    let bgClass = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500 hover:text-white';
                    if (isBooked) {
                      bgClass = 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50';
                    } else if (isSelected) {
                      bgClass = 'bg-rose-600 border-rose-500 text-white font-extrabold shadow-glow scale-110 z-10';
                    } else if (seat.seat_type === 'VIP') {
                      bgClass = 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400';
                    } else if (seat.seat_type === 'PREMIUM') {
                      bgClass = 'bg-slate-900/90 border-slate-600 text-slate-200 hover:border-rose-400';
                    }

                    return (
                      <button
                        key={seat.id}
                        disabled={isBooked}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg border text-xs font-bold transition-all duration-200 flex items-center justify-center ${bgClass}`}
                        title={`${seat.seat_number} - ${seat.seat_type} (₹${seat.price})`}
                      >
                        {seat.seat_number.replace(rowName, '')}
                      </button>
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <span className="w-6 text-center text-xs font-bold text-slate-400">{rowName}</span>
              </div>
            ))}
          </div>

          {/* Seat Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-slate-800/80 w-full max-w-xl text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700"></div>
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-rose-600 border border-rose-500 shadow-glow"></div>
              <span className="text-white font-bold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-800/40 border border-slate-800 opacity-50"></div>
              <span className="text-slate-500">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-950/40 border border-amber-500/40"></div>
              <span className="text-amber-400 font-medium">VIP (₹250)</span>
            </div>
          </div>

        </div>

        {/* Dynamic Booking Summary Sidebar (Right Col) */}
        <div className="space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 sticky top-24">
            
            <h2 className="font-display font-bold text-xl text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-rose-500" />
              <span>Booking Summary</span>
            </h2>

            {/* Selected Seats Listing */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>Selected Seats</span>
                <span className="text-rose-400">{bookingState.selectedSeats.length} Seats</span>
              </div>

              {bookingState.selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {bookingState.selectedSeats.map(s => (
                    <span
                      key={s.id}
                      className="px-3 py-1 bg-rose-500/20 text-rose-300 font-bold text-xs rounded-lg border border-rose-500/30 flex items-center gap-1"
                    >
                      {s.seat_number} <span className="text-[10px] text-slate-400">({s.seat_type})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No seats selected yet. Click seats on the layout.</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 border-t border-b border-slate-800/80 py-4 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Tickets Subtotal</span>
                <span className="font-bold text-white">₹{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Convenience Fee</span>
                <span className="font-bold text-white">₹{getConvenienceFee().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                <span>Total Payable</span>
                <span className="text-rose-500 font-display text-xl">₹{getTotalAmount().toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed CTA Button */}
            <button
              disabled={bookingState.selectedSeats.length === 0}
              onClick={handleProceed}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                bookingState.selectedSeats.length > 0
                  ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-glow hover:shadow-glow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

      {toastMsg && <Toast message={toastMsg} type="error" onClose={() => setToastMsg('')} />}

    </div>
  );
}
