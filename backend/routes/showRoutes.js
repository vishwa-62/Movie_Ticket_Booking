const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', showController.getAllShows);
router.get('/:id', showController.getShowById);
router.get('/:id/seats', showController.getShowSeats);

router.post('/', verifyToken, isAdmin, showController.createShow);
router.delete('/:id', verifyToken, isAdmin, showController.deleteShow);

module.exports = router;
