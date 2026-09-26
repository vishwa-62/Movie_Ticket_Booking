import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Spinner } from '../../components/Loader';
import { BarChart3, TrendingUp, DollarSign, Film } from 'lucide-react';

export default function ReportsAnalytics() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/revenue');
      if (res.data.success) {
        setReport(res.data.byMovie);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalGross = report.reduce((sum, item) => sum + Number(item.total_revenue || 0), 0);

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display font-extrabold text-3xl text-white">Revenue & Movie Performance Reports</h1>
        <p className="text-xs text-slate-400">Box office breakdown by film title and ticket sales volume</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Filtered Gross</span>
          <div className="font-display font-extrabold text-3xl text-emerald-400 mt-1">₹{totalGross.toFixed(2)}</div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
          <TrendingUp className="w-6 h-6" />
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
                  <th className="px-4 py-3.5">Movie Title</th>
                  <th className="px-4 py-3.5">Total Bookings Count</th>
                  <th className="px-4 py-3.5">Gross Revenue</th>
                  <th className="px-4 py-3.5">Market Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {report.map(item => {
                  const pct = totalGross > 0 ? ((item.total_revenue / totalGross) * 100).toFixed(1) : '0';
                  return (
                    <tr key={item.title} className="hover:bg-slate-900/50">
                      <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                        <Film className="w-4 h-4 text-rose-500" />
                        <span>{item.title}</span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold">{item.booking_count} Bookings</td>
                      <td className="px-4 py-3.5 font-extrabold text-emerald-400">₹{Number(item.total_revenue).toFixed(2)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-slate-400 font-bold">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
