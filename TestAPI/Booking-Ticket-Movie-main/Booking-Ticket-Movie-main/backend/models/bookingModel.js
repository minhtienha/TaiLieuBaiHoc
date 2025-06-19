// bookingModel.js
const { sql } = require('../config/db'); // Import kết nối SQL từ db.js

// Hàm lấy thông tin lịch chiếu theo tên phim
const getShowtimes = async (movieTitle) => {
  try {
    const request = new sql.Request();
    const result = await request
      .input('movieTitle', sql.NVarChar, movieTitle)
      .query(`
        SELECT TENPHIM, NGAYCHIEU, TINHTHANH, TENRAP, GIOBATDAU, GIOKETTHUC, POSTER
        FROM SUATCHIEU
        JOIN CHITIETSUAT ON SUATCHIEU.MASUAT = CHITIETSUAT.MASUAT
        JOIN PHIM ON CHITIETSUAT.MAPHIM = PHIM.MAPHIM
        JOIN PHONGCHIEU ON SUATCHIEU.MAPHONG = PHONGCHIEU.MAPHONG
        JOIN RAP ON PHONGCHIEU.MARAP = RAP.MARAP
        WHERE PHIM.TENPHIM = @movieTitle
      `);
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching showtimes: ' + error.message);
  }
};

const getMaPhongChieu = async (movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau) => {
  try {
    const request = new sql.Request();
    // const gioBatDauTime = new Date(`1970-01-01T${gioBatDau}Z`).toISOString();
    // Truyền trực tiếp gioBatDau mà không cần chuyển đổi
    const result = await request
      .input('movieTitle', sql.NVarChar, movieTitle)
      .input('ngayChieu', sql.Date, ngayChieu)
      .input('tinhThanh', sql.NVarChar, tinhThanh)
      .input('tenRap', sql.NVarChar, tenRap)
      .input('gioBatDau', sql.Time, gioBatDau)  // Truyền trực tiếp
      .query(`
        SET DATEFORMAT DMY
        SELECT PHONGCHIEU.MAPHONG 
        FROM SUATCHIEU 
        JOIN CHITIETSUAT ON SUATCHIEU.MASUAT = CHITIETSUAT.MASUAT 
        JOIN PHIM ON CHITIETSUAT.MAPHIM = PHIM.MAPHIM 
        JOIN PHONGCHIEU ON SUATCHIEU.MAPHONG = PHONGCHIEU.MAPHONG
        JOIN RAP ON PHONGCHIEU.MARAP = RAP.MARAP
        WHERE PHIM.TENPHIM = @movieTitle 
          AND NGAYCHIEU = @ngayChieu 
          AND TINHTHANH = @tinhThanh 
          AND TENRAP = @tenRap 
          AND GIOBATDAU = @gioBatDau
      `);
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching MaPhongChieu: ' + error.message);
  }
};

const getCodeSchedule = async (movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau) => {
  try {
    const request = new sql.Request();
    // const gioBatDauTime = new Date(`1970-01-01T${gioBatDau}Z`).toISOString();
    // Truyền trực tiếp gioBatDau mà không cần chuyển đổi
    const result = await request
      .input('movieTitle', sql.NVarChar, movieTitle)
      .input('ngayChieu', sql.Date, ngayChieu)
      .input('tinhThanh', sql.NVarChar, tinhThanh)
      .input('tenRap', sql.NVarChar, tenRap)
      .input('gioBatDau', sql.Time, gioBatDau)  // Truyền trực tiếp
      .query(`
        SET DATEFORMAT DMY
        SELECT SUATCHIEU.MASUAT 
        FROM SUATCHIEU 
        JOIN CHITIETSUAT ON SUATCHIEU.MASUAT = CHITIETSUAT.MASUAT 
        JOIN PHIM ON CHITIETSUAT.MAPHIM = PHIM.MAPHIM 
        JOIN PHONGCHIEU ON SUATCHIEU.MAPHONG = PHONGCHIEU.MAPHONG
        JOIN RAP ON PHONGCHIEU.MARAP = RAP.MARAP
        WHERE PHIM.TENPHIM = @movieTitle 
          AND NGAYCHIEU = @ngayChieu 
          AND TINHTHANH = @tinhThanh 
          AND TENRAP = @tenRap 
          AND GIOBATDAU = @gioBatDau
      `);
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching MaSuatChieu: ' + error.message);
  }
};

const getNameRoom = async (movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau) => {
  try {
    const request = new sql.Request();
    // const gioBatDauTime = new Date(`1970-01-01T${gioBatDau}Z`).toISOString();
    const result = await request
      .input('movieTitle', sql.NVarChar, movieTitle)
      .input('ngayChieu', sql.Date, ngayChieu)
      .input('tinhThanh', sql.NVarChar, tinhThanh)
      .input('tenRap', sql.NVarChar, tenRap)
      .input('gioBatDau', sql.Time, gioBatDau)
      .query(`
        SET DATEFORMAT DMY
        SELECT TENPHONG 
        FROM SUATCHIEU 
        JOIN CHITIETSUAT ON SUATCHIEU.MASUAT = CHITIETSUAT.MASUAT 
        JOIN PHIM ON CHITIETSUAT.MAPHIM = PHIM.MAPHIM 
        JOIN PHONGCHIEU ON SUATCHIEU.MAPHONG = PHONGCHIEU.MAPHONG
        JOIN RAP ON PHONGCHIEU.MARAP = RAP.MARAP
        WHERE PHIM.TENPHIM = @movieTitle 
          AND NGAYCHIEU = @ngayChieu 
          AND TINHTHANH = @tinhThanh 
          AND TENRAP = @tenRap 
          AND GIOBATDAU = @gioBatDau
      `);
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching TENPHONG: ' + error.message);
  }
};

const getSeatBooked = async (giobatdau, gioketthuc, ngay, maphong) => {
  console.log('gibatdau', giobatdau);
  console.log('gioketthuc', gioketthuc);
  console.log('ngay', ngay);
  console.log('maphong', maphong);
  try {
    const request = new sql.Request();
    const result = await request
      .input('giobatdau', sql.VarChar, giobatdau)
      .input('gioketthuc', sql.VarChar, gioketthuc)
      .input('ngay', sql.Date, ngay)
      .input('maphong', sql.NVarChar, maphong)
      .query(`
        SET DATEFORMAT DMY
        select CHITIETGHE.MAGHE from CHITIETGHE join GHE on CHITIETGHE.MAGHE=GHE.MAGHE 
        join PHONGCHIEU on GHE.MAPHONG=PHONGCHIEU.MAPHONG
        where GIOBATDAU=@giobatdau and 
        GIOKETTHUC=@gioketthuc and
        NGAY = @ngay and PHONGCHIEU.MAPHONG=@maphong
      `);
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching MAGHE: ' + error.message);
  }
}

module.exports = {
  getShowtimes,
  getMaPhongChieu,
  getNameRoom,
  getCodeSchedule,
  getSeatBooked,
};
