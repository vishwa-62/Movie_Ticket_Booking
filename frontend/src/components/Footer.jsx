import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Award, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080b10] border-t border-slate-800/80 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-glow">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                CINE<span className="text-rose-500">PASS</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Experience movie magic like never before. Instant seat selection, seamless digital tickets, and access to premium IMAX & Dolby Atmos theatres nationwide.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Tickets</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Award className="w-4 h-4 text-amber-400" />
                <span>4.9★ Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-display">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/movies" className="hover:text-rose-400 transition">Now Showing</Link></li>
              <li><Link to="/movies?status=COMING_SOON" className="hover:text-rose-400 transition">Coming Soon</Link></li>
              <li><Link to="/theatres" className="hover:text-rose-400 transition">Featured Theatres</Link></li>
              <li><Link to="/about" className="hover:text-rose-400 transition">About CinePass</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-display">Help & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/my-bookings" className="hover:text-rose-400 transition">My Bookings</Link></li>
              <li><Link to="/contact" className="hover:text-rose-400 transition">Contact Support</Link></li>
              <li><Link to="/contact#faq" className="hover:text-rose-400 transition">FAQs</Link></li>
              <li><span className="cursor-pointer hover:text-rose-400 transition">Cancellation Policy</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 font-display">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>+91 (0422) 4920-800</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>support@cinepass.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} CinePass Movie Booking Application. All Rights Reserved.</p>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Cinema Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
