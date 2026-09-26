import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/Loader';
import Toast from '../../components/Toast';
import { Calendar, Plus, Trash2, Clock, MapPin, Tv, DollarSign, X } from 'lucide-react';

export default function ManageShows() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    movie_id: '',
    theatre_id: '',
    screen_id: '1',
    show_date: new Date().toISOString().split('T')[0],
    show_time: '07:30 PM',
    ticket_price: 200
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [sRes, mRes, tRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies'),
        api.get('/theatres')
      ]);

      if (sRes.data.success) setShows(sRes.data.shows);
      if (mRes.data.success) {
        setMovies(mRes.data.movies);
        if (mRes.data.movies.length > 0) {
          setFormData(prev => ({ ...prev, movie_id: mRes.data.movies[0].id }));
        }
      }
      if (tRes.data.success) {
        setTheatres(tRes.data.theatres);
        if (tRes.data.theatres.length > 0) {
          setFormData(prev => ({ ...prev, theatre_id: tRes.data.theatres[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this showtime schedule?')) return;
    try {
      const res = await api.delete(`/shows/${id}`);
      if (res.data.success) {
        setToastMsg('Show schedule deleted.');
        fetchInitialData();
      }
    } catch (err) {
      setToastMsg('Failed to delete show.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/shows', formData);
      if (res.data.success) {
        setToastMsg('New showtime scheduled successfully!');
        setModalOpen(false);
        fetchInitialData();
      }
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Error scheduling show.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">Showtimes & Schedule Management</h1>
          <p className="text-xs text-slate-400">Schedule movie sessions across multiplex screens</p>
        </div>

        <button
          onClick={openModal}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-glow transition flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Show</span>
        </button>
      </div>

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg('')} />}

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
                  <th className="px-4 py-3.5">Movie</th>
                  <th className="px-4 py-3.5">Theatre & Location</th>
                  <th className="px-4 py-3.5">Screen</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Ticket Price</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {shows.map(s => (
                  <tr key={s.id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                      <img src={s.movie_poster} alt="" className="w-7 h-9 object-cover rounded bg-slate-800" />
                      <span>{s.movie_title}</span>
                    </td>
                    <td className="px-4 py-3">{s.theatre_name}, {s.city}</td>
                    <td className="px-4 py-3 text-rose-400 font-semibold">{s.screen_name || 'Screen 1'}</td>
                    <td className="px-4 py-3 font-semibold text-white">{s.show_date} ({s.show_time})</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">₹{Number(s.ticket_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-white">Schedule New Showtime</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Select Movie</label>
                <select
                  value={formData.movie_id}
                  onChange={(e) => setFormData({ ...formData, movie_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {movies.map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-900">{m.title} ({m.language})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Select Theatre</label>
                <select
                  value={formData.theatre_id}
                  onChange={(e) => setFormData({ ...formData, theatre_id: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {theatres.map(t => (
                    <option key={t.id} value={t.id} className="bg-slate-900">{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.show_date}
                    onChange={(e) => setFormData({ ...formData, show_date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400">Show Time</label>
                  <select
                    value={formData.show_time}
                    onChange={(e) => setFormData({ ...formData, show_time: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    {['10:00 AM', '01:30 PM', '04:30 PM', '06:45 PM', '07:30 PM', '10:00 PM'].map(t => (
                      <option key={t} value={t} className="bg-slate-900">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Standard Ticket Price (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.ticket_price}
                  onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-glow transition mt-2"
              >
                Schedule Showtime
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
