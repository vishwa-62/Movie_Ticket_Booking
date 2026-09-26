import React from 'react';
import { Film, Award, Shield, Users, Zap, Tv } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 px-3.5 py-1 rounded-full text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Film className="w-4 h-4 text-amber-400" />
          <span>About CinePass</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
          Redefining the Cinema Ticket Experience
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          CinePass is a next-generation movie ticket booking web platform designed for movie lovers who value speed, beautiful design, and seamless seat selection.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-2">
          <div className="font-display font-extrabold text-4xl text-rose-500">100K+</div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Happy Cinephiles</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-2">
          <div className="font-display font-extrabold text-4xl text-amber-400">150+</div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Partner Multiplexes</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-2">
          <div className="font-display font-extrabold text-4xl text-emerald-400">99.9%</div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Uptime & Instant Tickets</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-2">
          <div className="font-display font-extrabold text-4xl text-sky-400">4.9★</div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Customer Experience</div>
        </div>
      </div>

      {/* Core Features */}
      <div className="space-y-8">
        <h2 className="font-display font-extrabold text-2xl text-white text-center">Why Choose CinePass?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Instant Seat Reservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time interactive seat layouts with double-booking prevention ensure your chosen seat is locked instantly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">IMAX & Dolby Atmos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover premium screen types including 4K Laser Projection, VIP Recliners, and Dolby Surround Sound.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Digital PDF & QR Tickets</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download stylized PDF tickets right from your browser and scan the embedded QR code directly at theatre gates.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
