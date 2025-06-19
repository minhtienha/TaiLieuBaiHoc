const { sql } = require('../config/db'); // Import kết nối SQL từ db.js

const getAllMovies = async () => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM PHIM');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching movies: ' + error.message);
  }
};

const getOneMovie = async (id) => {
  try {
    const request = new sql.Request();
    const result = await request
      .input('id', sql.Int, id)
      .query('SELECT * FROM PHIM WHERE SUBSTRING(MAPHIM, 13, LEN(MAPHIM) - 12) = @id');
    return result.recordset[0];
  } catch (error) {
    throw new Error('Error fetching movie: ' + error.message);
  }
};

const getOneMovieWithName = async (name) => {
  try {
    const request = new sql.Request();
    const result = await request
      .input('TENPHIM', sql.NVarChar, `%${name}%`)
      .query('SELECT * FROM PHIM WHERE TENPHIM LIKE @TENPHIM');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching movie: ' + error.message);
  }
};

const getUpcomingMovies = async () => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM PHIM WHERE NGAYKHOICHIEU > GETDATE()');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching upcoming movies: ' + error.message);
  }
};

const getIsShowing = async () => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM PHIM WHERE NGAYKHOICHIEU <= GETDATE()');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching upcoming movies: ' + error.message);
  }
};

const createMovie = async (movie) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('TenPhim', sql.NVarChar, movie.TenPhim)
            .input('DaoDien', sql.NVarChar, movie.DaoDien)
            .input('DienVien', sql.NVarChar, movie.DienVien)
            .input('TheLoai', sql.NVarChar, movie.TheLoai)
            .input('NgayKhoiChieu', sql.DateTime, movie.NgayKhoiChieu)
            .input('ThoiLuong', sql.Int, movie.ThoiLuong)
            .input('MoTa', sql.NVarChar, movie.MoTa)
            .input('Poster', sql.NVarChar, movie.Poster)
            .input('Trailer', sql.NVarChar, movie.Trailer)
            .query(`INSERT INTO PHIM (TENPHIM, DAODIEN, DIENVIEN, THELOAI, NGAYKHOICHIEU, THOILUONG, MOTA, POSTER, TRAILER)
                            VALUES (@TenPhim, @DaoDien, @DienVien, @TheLoai, @NgayKhoiChieu, @ThoiLuong, @MoTa, @Poster, @Trailer)`);
        return result.rowsAffected;
    } catch (error) {
        throw new Error('Error creating movie: ' + error.message);
    }
};

const updateMovie = async (id, movie) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('id', sql.VarChar, id)
            .input('TenPhim', sql.NVarChar, movie.TenPhim)
            .input('DaoDien', sql.NVarChar, movie.DaoDien)
            .input('DienVien', sql.NVarChar, movie.DienVien)
            .input('TheLoai', sql.NVarChar, movie.TheLoai)
            .input('NgayKhoiChieu', sql.DateTime, movie.NgayKhoiChieu)
            .input('ThoiLuong', sql.Int, movie.ThoiLuong)
            .input('MoTa', sql.NVarChar, movie.MoTa)
            .input('Poster', sql.NVarChar, movie.Poster)
            .input('Trailer', sql.NVarChar, movie.Trailer)
            .query(`UPDATE PHIM SET 
                                TENPHIM = @TenPhim, 
                                DAODIEN = @DaoDien, 
                                DIENVIEN = @DienVien, 
                                THELOAI = @TheLoai, 
                                NGAYKHOICHIEU = @NgayKhoiChieu, 
                                THOILUONG = @ThoiLuong, 
                                MOTA = @MoTa, 
                                POSTER = @Poster, 
                                TRAILER = @Trailer 
                            WHERE MAPHIM = @Id`);
        return result.rowsAffected;
    } catch (error) {
        throw new Error('Error updating movie: ' + error.message);
    }
};

const deleteMovie = async (id) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('Id', sql.VarChar, id)
            .query('DELETE FROM PHIM WHERE MAPHIM = @Id');
        return result.rowsAffected;
    } catch (error) {
        throw new Error('Error deleting movie: ' + error.message);
    }
};

module.exports = {
  getAllMovies,
  getOneMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getOneMovieWithName,
  getUpcomingMovies,
  getIsShowing,
};