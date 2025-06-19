const { getService } = require('../models/serviceModel'); // Import hàm getAllMovies từ movieModel

exports.getService = async (req, res) => {
  try {
    const movies = await getService();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};