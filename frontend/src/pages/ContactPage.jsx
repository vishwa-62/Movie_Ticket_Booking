import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import Toast from '../components/Toast';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setToastMsg('Thank you! Your message has been sent to our customer care team.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
          Get in Touch with CinePass
        </h1>
        <p className="text-slate-400 text-sm">
          Have questions about booking, cancellations, or theatre partnerships? We are here 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-rose-500">
              <MapPin className="w-6 h-6" />
              <h3 className="font-display font-bold text-lg text-white">Headquarters</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              CinePass Technologies Pvt. Ltd.<br />
              Krishnaswamy Road, RS Puram<br />
              Coimbatore - 641002, Tamil Nadu
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-rose-500">
              <Phone className="w-6 h-6" />
              <h3 className="font-display font-bold text-lg text-white">24/7 Helpline</h3>
            </div>
            <p className="text-xs text-slate-300">
              +91 (0422) 4920-800<br />
              Toll Free: 1800-425-9999
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3 text-rose-500">
              <Mail className="w-6 h-6" />
              <h3 className="font-display font-bold text-lg text-white">Email Enquiries</h3>
            </div>
            <p className="text-xs text-slate-300">
              support@cinepass.com<br />
              partners@cinepass.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-rose-500" />
            <span>Send Us a Message</span>
          </h2>

          {submitted && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Your message was delivered! We will respond within 2 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</label>
              <input
                type="text"
                required
                placeholder="Booking Help / Refund Request"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message</label>
              <textarea
                rows="4"
                required
                placeholder="Describe your inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>

          </form>

        </div>

      </div>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

    </div>
  );
}
