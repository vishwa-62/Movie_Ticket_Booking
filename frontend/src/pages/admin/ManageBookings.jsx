import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/Loader';
import { Ticket, Search, Calendar, User, MapPin } from 'lucide-react';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => 
    b.booking_code?.toLowerCase().includes(search.toLowerCase()) ||
    b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.movie_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">All Customer Bookings</h1>
          <p className="text-xs text-slate-400">Master database log of system ticket reservations</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search code, customer or movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-3.5">Booking Code</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Movie</th>
                  <th className="px-4 py-3.5">Theatre & Date</th>
                  <th className="px-4 py-3.5">Total Paid</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Booked At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3.5 font-bold text-rose-400">{b.booking_code}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{b.user_name}</div>
                      <div className="text-[10px] text-slate-400">{b.user_email}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">{b.movie_title}</td>
                    <td className="px-4 py-3.5">
                      <div>{b.theatre_name}</div>
                      <div className="text-[10px] text-slate-400">{b.show_date} ({b.show_time})</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-400">₹{Number(b.total_amount).toFixed(2)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.booking_status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{new Date(b.booked_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
