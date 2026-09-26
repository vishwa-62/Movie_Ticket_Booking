const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, paymentController.processPayment);
router.get('/:bookingId', verifyToken, paymentController.getPaymentByBooking);

module.exports = router;
