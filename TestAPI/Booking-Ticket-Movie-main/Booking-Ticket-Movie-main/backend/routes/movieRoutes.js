const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/search/:name', movieController.getOneMovieWithName);
router.get('/upcoming', movieController.getUpcomingMovies);
router.get('/isshowing', movieController.getIsShowing);
router.get('/:id', movieController.getOneMovie);
router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
