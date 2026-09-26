import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Spinner } from '../components/Loader';
import Toast from '../components/Toast';
import { CreditCard, QrCode, Building, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PaymentPage() {
  const { bookingState, getTotalAmount, clearBooking } = useBooking();
  const navigate = useNavigate();

  const [paymentTab, setPaymentTab] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING'
  const [upiId, setUpiId] = useState('user@upi');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8921',
    expiry: '12/28',
    cvv: '992',
    name: 'Alex Morgan'
  });
  const [bank, setBank] = useState('HDFC Bank');

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { movie, show, selectedSeats } = bookingState;

  if (!show || selectedSeats.length === 0) {
    navigate('/movies');
    return null;
  }

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg('');

    try {
      const payload = {
        show_id: show.id,
        seat_ids: selectedSeats.map(s => s.id),
        payment_method: paymentTab
      };

      const res = await api.post('/bookings', payload);

      if (res.data.success) {
        const { bookingId } = res.data;
        setTimeout(() => {
          setProcessing(false);
          navigate(`/booking-success?bookingId=${bookingId}`);
        }, 1500);
      }
    } catch (err) {
      setProcessing(false);
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please retry.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-white">Payment Checkout</h1>
        <p className="text-xs text-slate-400">Total Amount Payable: <strong className="text-rose-500 font-display text-lg">₹{getTotalAmount().toFixed(2)}</strong></p>
      </div>

      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg('')} />}

      {/* Main Payment Container */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        
        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 bg-slate-950 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPaymentTab('UPI')}
            className={`py-4 flex items-center justify-center space-x-2 transition ${
              paymentTab === 'UPI' ? 'bg-slate-900 text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentTab('CARD')}
            className={`py-4 flex items-center justify-center space-x-2 transition ${
              paymentTab === 'CARD' ? 'bg-slate-900 text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Credit/Debit Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentTab('NETBANKING')}
            className={`py-4 flex items-center justify-center space-x-2 transition ${
              paymentTab === 'NETBANKING' ? 'bg-slate-900 text-rose-500 border-b-2 border-rose-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* Tab Form */}
        <form onSubmit={handlePaySubmit} className="p-6 sm:p-8 space-y-6">
          
          {paymentTab === 'UPI' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="w-32 h-32 bg-white p-2 mx-auto rounded-xl flex items-center justify-center">
                  <div className="w-full h-full border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-800 font-mono text-[10px] font-bold text-center">
                    [SIMULATED UPI QR CODE]
                  </div>
                </div>
                <p className="text-xs text-slate-400">Scan using GPay, PhonePe, Paytm or enter VPA ID below</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {paymentTab === 'CARD' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Number</label>
                <input
                  type="text"
                  required
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CVV</label>
                  <input
                    type="password"
                    maxLength="3"
                    required
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentTab === 'NETBANKING' && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Select Preferred Bank</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bName => (
                  <button
                    key={bName}
                    type="button"
                    onClick={() => setBank(bName)}
                    className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                      bank === bName ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {bName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-base rounded-2xl shadow-glow transition flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Spinner size="sm" />
                  <span>Processing Payment Authorization...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{getTotalAmount().toFixed(2)} Securely</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
