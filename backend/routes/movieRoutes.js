const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

router.post('/', verifyToken, isAdmin, upload.single('poster'), movieController.createMovie);
router.put('/:id', verifyToken, isAdmin, upload.single('poster'), movieController.updateMovie);
router.delete('/:id', verifyToken, isAdmin, movieController.deleteMovie);

module.exports = router;
