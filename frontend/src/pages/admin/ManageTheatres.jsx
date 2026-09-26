import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/Loader';
import Toast from '../../components/Toast';
import { Building2, Plus, Edit, Trash2, MapPin, X } from 'lucide-react';

export default function ManageTheatres() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    city: 'Coimbatore'
  });

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const res = await api.get('/theatres');
      if (res.data.success) {
        setTheatres(res.data.theatres);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTheatre(null);
    setFormData({ name: '', location: '', address: '', city: 'Coimbatore' });
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTheatre(t);
    setFormData({ name: t.name, location: t.location, address: t.address, city: t.city });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theatre and all associated screens?')) return;
    try {
      const res = await api.delete(`/theatres/${id}`);
      if (res.data.success) {
        setToastMsg('Theatre deleted successfully.');
        fetchTheatres();
      }
    } catch (err) {
      setToastMsg('Failed to delete theatre.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTheatre) {
        const res = await api.put(`/theatres/${editingTheatre.id}`, formData);
        if (res.data.success) {
          setToastMsg('Theatre updated!');
          setModalOpen(false);
          fetchTheatres();
        }
      } else {
        const res = await api.post('/theatres', formData);
        if (res.data.success) {
          setToastMsg('Theatre created with 56 default screen seats!');
          setModalOpen(false);
          fetchTheatres();
        }
      }
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Error saving theatre.');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">Theatre & Screen Management</h1>
          <p className="text-xs text-slate-400">Add multiplex locations and manage screen configurations</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-glow transition flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Theatre</span>
        </button>
      </div>

      {toastMsg && <Toast message={toastMsg} type="info" onClose={() => setToastMsg('')} />}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theatres.map(t => (
            <div key={t.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{t.name}</h3>
                  <p className="text-xs text-rose-400 font-semibold">{t.city}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{t.address}, {t.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display font-bold text-lg text-white">
                {editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Theatre Name</label>
                <input
                  type="text"
                  required
                  placeholder="PVR Cinemas - Brookefields"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Location / Mall</label>
                <input
                  type="text"
                  required
                  placeholder="Brookefields Mall"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Full Address</label>
                <input
                  type="text"
                  required
                  placeholder="Krishnaswamy Road, RS Puram"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">City</label>
                <input
                  type="text"
                  required
                  placeholder="Coimbatore"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-glow transition mt-2"
              >
                Save Theatre
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
