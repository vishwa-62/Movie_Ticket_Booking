const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/dashboard', verifyToken, isAdmin, adminController.getDashboardStats);
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/bookings', verifyToken, isAdmin, adminController.getAllBookings);
router.get('/revenue', verifyToken, isAdmin, adminController.getRevenueReport);

module.exports = router;
