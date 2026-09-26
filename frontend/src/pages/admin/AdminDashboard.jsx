import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/Loader';
import { 
  Users, 
  Film, 
  Building2, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ShieldCheck 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Monthly Sales Chart Data
  const monthlyLabels = stats.monthlySales.map(m => m.month);
  const monthlyData = stats.monthlySales.map(m => m.revenue);

  const lineChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: monthlyData,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: ['Avengers', 'Interstellar', 'Leo', 'Vikram', 'Jailer'],
    datasets: [
      {
        label: 'Ticket Sales Volume',
        data: [1420, 1180, 950, 890, 780],
        backgroundColor: '#f59e0b'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } }
      }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-white">System Executive Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time revenue metrics, booking counts, and multiplex performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="font-display font-extrabold text-3xl text-white">{stats.totalUsers}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Movies</span>
            <Film className="w-5 h-5 text-rose-500" />
          </div>
          <div className="font-display font-extrabold text-3xl text-white">{stats.totalMovies}</div>
          <div className="text-[11px] text-slate-400 font-semibold">{stats.activeShows} Active Showtimes</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Theatres</span>
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="font-display font-extrabold text-3xl text-white">{stats.totalTheatres}</div>
          <div className="text-[11px] text-slate-400 font-semibold">Multiple Cities</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-display font-extrabold text-3xl text-emerald-400">₹{stats.totalRevenue.toFixed(0)}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">+18.5% Growth</div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Monthly Revenue Trends</h3>
          <Line data={lineChartData} options={chartOptions} />
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Popular Movie Ticket Volume</h3>
          <Bar data={barChartData} options={chartOptions} />
        </div>

      </div>

      {/* Recent Customer Bookings Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-display font-bold text-lg text-white">Recent Customer Bookings</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Booking Code</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Movie</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats.recentBookings?.map(b => (
                <tr key={b.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3.5 font-bold text-rose-400">{b.booking_code}</td>
                  <td className="px-4 py-3.5 font-semibold text-white">{b.user_name}</td>
                  <td className="px-4 py-3.5">{b.movie_title}</td>
                  <td className="px-4 py-3.5 font-bold text-white">₹{Number(b.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      {b.booking_status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{new Date(b.booked_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
