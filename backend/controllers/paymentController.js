const db = require('../config/db');

exports.processPayment = async (req, res) => {
  try {
    const { booking_id, payment_method, amount } = req.body;
    const transactionId = 'TXN_' + Date.now() + Math.floor(1000 + Math.random() * 9000);

    if (db.isMySQL && db.pool) {
      await db.pool.query(
        'INSERT INTO payments (booking_id, payment_method, transaction_id, amount, payment_status) VALUES (?, ?, ?, ?, ?)',
        [booking_id, payment_method || 'UPI', transactionId, amount, 'SUCCESS']
      );
      await db.pool.query("UPDATE bookings SET payment_status = 'SUCCESS' WHERE id = ?", [booking_id]);
    } else {
      db.memoryDb.data.payments.push({
        id: db.memoryDb.getNextId('payments'),
        booking_id,
        payment_method: payment_method || 'UPI',
        transaction_id: transactionId,
        amount,
        payment_status: 'SUCCESS',
        paid_at: new Date().toISOString()
      });
      const b = db.memoryDb.data.bookings.find(item => item.id === booking_id);
      if (b) b.payment_status = 'SUCCESS';
    }

    return res.json({
      success: true,
      message: 'Payment processed successfully!',
      transaction_id: transactionId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
};

exports.getPaymentByBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (db.isMySQL && db.pool) {
      const [payments] = await db.pool.query('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
      if (payments.length === 0) return res.status(404).json({ success: false, message: 'Payment record not found.' });
      return res.json({ success: true, payment: payments[0] });
    } else {
      const payment = db.memoryDb.data.payments.find(p => p.booking_id === bookingId);
      if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found.' });
      return res.json({ success: true, payment });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving payment details.' });
  }
};
