import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Loader';
import { Ticket, Film, Ban, CreditCard, ChevronRight, Download, Calendar, MapPin } from 'lucide-react';
import { generatePDFTicket } from '../utils/TicketPDF';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => b.booking_status === 'CONFIRMED');
  const cancelledBookings = bookings.filter(b => b.booking_status === 'CANCELLED');
  const totalAmountSpent = bookings
    .filter(b => b.payment_status === 'SUCCESS')
    .reduce((sum, b) => sum + Number(b.total_amount), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">
            Hello, <span className="text-rose-500">{user?.name || 'Movie Fan'}</span>!
          </h1>
          <p className="text-xs text-slate-400">Welcome to your personal CinePass account dashboard</p>
        </div>
        <Link
          to="/movies"
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-glow transition"
        >
          Book New Movies
        </Link>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <Ticket className="w-5 h-5 text-rose-500" />
          </div>
          <div className="font-display font-extrabold text-3xl text-white">{totalBookings}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Shows</span>
            <Film className="w-5 h-5 text-amber-400" />
          </div>
          <div className="font-display font-extrabold text-3xl text-amber-400">{upcomingBookings.length}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cancelled</span>
            <Ban className="w-5 h-5 text-rose-400" />
          </div>
          <div className="font-display font-extrabold text-3xl text-rose-400">{cancelledBookings.length}</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spent</span>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-display font-extrabold text-3xl text-emerald-400">₹{totalAmountSpent.toFixed(0)}</div>
        </div>

      </div>

      {/* Upcoming & Recent Bookings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-white">Upcoming & Recent Bookings</h2>
          <Link to="/my-bookings" className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className="w-16 h-20 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={b.movie_poster} alt={b.movie_title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{b.movie_title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{b.theatre_name} • {b.screen_name}</span>
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>{b.show_date} ({b.show_time})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    b.booking_status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {b.booking_status}
                  </span>

                  <button
                    onClick={() => generatePDFTicket(b)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                    title="Download Ticket PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/my-bookings/${b.id}`}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-glow"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 text-sm">
            No bookings found yet. Reserve your first movie ticket today!
          </div>
        )}
      </div>

    </div>
  );
}
