import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { generatePDFTicket } from '../utils/TicketPDF';
import { Spinner } from '../components/Loader';
import { CheckCircle2, Download, Printer, Ticket, Calendar, Clock, MapPin, Tv } from 'lucide-react';

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger festive celebratory confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${bookingId}`);
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

  const seatNumbers = booking.seats?.map(s => s.seat_number).join(', ') || 'A1, A2';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-4 bg-emerald-950/20 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          BOOKING CONFIRMED!
        </h1>
        <p className="text-xs text-slate-300">
          Your tickets have been reserved. Show the QR code or downloadable PDF at the cinema entrance.
        </p>
      </div>

      {/* Ticket Card Details */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Booking Reference ID</span>
            <div className="font-display font-extrabold text-2xl text-white tracking-wider">
              {booking.booking_code}
            </div>
          </div>

          <div className="bg-white p-2 rounded-xl shadow-lg">
            <QRCodeSVG value={booking.booking_code || 'MB-100200'} size={96} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Movie</span>
            <div className="text-sm font-bold text-white">{booking.movie_title}</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Theatre & Location</span>
            <div className="text-sm font-bold text-white">{booking.theatre_name}, {booking.city}</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Date & Showtime</span>
            <div className="text-sm font-bold text-white">{booking.show_date} ({booking.show_time})</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Screen & Seats</span>
            <div className="text-sm font-bold text-rose-400">{booking.screen_name} • Seats {seatNumbers}</div>
          </div>
        </div>

        {/* Amount Paid */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm">
          <span className="text-slate-400 font-semibold">Total Paid Amount:</span>
          <span className="font-display font-extrabold text-xl text-emerald-400">₹{Number(booking.total_amount).toFixed(2)}</span>
        </div>

        {/* Download & Print Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => generatePDFTicket(booking)}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-glow transition flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Ticket PDF</span>
          </button>

          <Link
            to="/my-bookings"
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition flex items-center justify-center space-x-2"
          >
            <Ticket className="w-4 h-4" />
            <span>View All My Bookings</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
