const { getAllMovies, createMovie, updateMovie, deleteMovie, getOneMovie, getOneMovieWithName, getUpcomingMovies, getIsShowing } = require('../models/movieModel'); // Import hàm getAllMovies từ movieModel

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOneMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movies = await getOneMovie(id);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOneMovieWithName = async (req, res) => {
  const { name } = req.params;
  console.log(name);
  try {
    const movie = await getOneMovieWithName(name);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUpcomingMovies = async (req, res) => {
  try {
    const movies = await getUpcomingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIsShowing = async (req, res) => {
  try {
    const movies = await getIsShowing();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.createMovie = async (req, res) => {
  const movie = new Movie(req.body);
  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const movie = req.body;
    try {
        const updated = await updateMovie(id, movie);
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteMovie(id);
        res.json(deleted);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};