import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Spinner } from '../components/Loader';
import Toast from '../components/Toast';
import { generatePDFTicket } from '../utils/TicketPDF';
import { Ticket, Calendar, MapPin, Download, Ban, Eye, Filter } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'
  const [toastMsg, setToastMsg] = useState('');
  const [cancelModalId, setCancelModalId] = useState(null);

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

  const handleCancelBooking = async (id) => {
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.data.success) {
        setToastMsg('Booking cancelled successfully. Refund initiated.');
        setCancelModalId(null);
        fetchBookings();
      }
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'UPCOMING') return b.booking_status === 'CONFIRMED';
    if (filter === 'CANCELLED') return b.booking_status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white tracking-tight flex items-center gap-3">
            <Ticket className="w-8 h-8 text-rose-500" />
            My Booking History
          </h1>
          <p className="text-xs text-slate-400 mt-1">View past and active movie ticket reservations</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start">
          {['ALL', 'UPCOMING', 'CANCELLED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                filter === f ? 'bg-rose-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg('')} />}

      {/* List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map(b => {
            const seatsStr = b.seats?.map(s => s.seat_number).join(', ') || 'A1, A2';
            const canCancel = b.booking_status === 'CONFIRMED';

            return (
              <div key={b.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-28 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800">
                      <img src={b.movie_poster} alt={b.movie_title} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">{b.booking_code}</span>
                      <h3 className="font-display font-bold text-xl text-white">{b.movie_title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{b.theatre_name} • {b.screen_name}</span>
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{b.show_date} ({b.show_time})</span>
                      </p>
                      <p className="text-xs text-slate-300 font-bold pt-1">
                        Seats: <span className="text-rose-400">{seatsStr}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end space-y-2 w-full md:w-auto">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      b.booking_status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {b.booking_status}
                    </span>
                    <span className="text-lg font-display font-extrabold text-white">₹{Number(b.total_amount).toFixed(2)}</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-500">Booked on: {new Date(b.booked_at).toLocaleString()}</div>

                  <div className="flex items-center space-x-3">
                    {canCancel && (
                      <button
                        onClick={() => setCancelModalId(b.id)}
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}

                    <button
                      onClick={() => generatePDFTicket(b)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>

                    <Link
                      to={`/my-bookings/${b.id}`}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-glow flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Ticket</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Bookings Found</h3>
          <p className="text-sm text-slate-400">You have no reservations under this filter status.</p>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 text-center">
            <h3 className="font-display font-bold text-xl text-white">Cancel Reservation?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel this booking? Amount will be refunded to your original payment method within 24 hours.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(cancelModalId)}
                className="flex-1 py-2.5 bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-glow"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
