import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { generatePDFTicket } from '../utils/TicketPDF';
import { Spinner } from '../components/Loader';
import { Ticket, ArrowLeft, Download, MapPin, Calendar, Clock, CreditCard, ShieldCheck } from 'lucide-react';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !booking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const seatNumbers = booking.seats?.map(s => s.seat_number).join(', ') || 'A1';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link to="/my-bookings" className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Booking Summary</span>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Booking Reference Code</span>
            <h1 className="font-display font-extrabold text-3xl text-white">{booking.booking_code}</h1>
          </div>

          <div className="bg-white p-2 rounded-xl">
            <QRCodeSVG value={booking.booking_code} size={88} />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Movie</span>
              <h2 className="text-lg font-bold text-white">{booking.movie_title}</h2>
              <p className="text-xs text-slate-400">{booking.language} • {booking.genre}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Theatre</span>
              <p className="text-sm font-semibold text-white">{booking.theatre_name}</p>
              <p className="text-xs text-slate-400">{booking.theatre_address}, {booking.city}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Showtime & Screen</span>
              <p className="text-sm font-semibold text-white">{booking.show_date} at {booking.show_time}</p>
              <p className="text-xs text-rose-400 font-bold">{booking.screen_name}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Reserved Seats</span>
              <p className="text-base font-extrabold text-white">{seatNumbers}</p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block">Payment Method: <strong className="text-white">{booking.payment_method}</strong></span>
            <span className="text-slate-500 block">TXN: {booking.transaction_id}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Total Amount</span>
            <span className="text-xl font-display font-extrabold text-emerald-400">₹{Number(booking.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => generatePDFTicket(booking)}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-glow transition flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Printable PDF Ticket</span>
        </button>

      </div>

    </div>
  );
}
