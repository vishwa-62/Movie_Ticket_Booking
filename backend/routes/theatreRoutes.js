const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', theatreController.getAllTheatres);
router.get('/:id', theatreController.getTheatreById);

router.post('/', verifyToken, isAdmin, theatreController.createTheatre);
router.put('/:id', verifyToken, isAdmin, theatreController.updateTheatre);
router.delete('/:id', verifyToken, isAdmin, theatreController.deleteTheatre);

module.exports = router;
