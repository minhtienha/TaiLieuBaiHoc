// bookingController.js
const { getShowtimes, getMaPhongChieu, getNameRoom , getCodeSchedule, getSeatBooked } = require('../models/bookingModel'); // Import hàm từ bookingModel

// Hàm xử lý lấy thông tin lịch chiếu tổ chức theo cấu trúc phân cấp
exports.getOrganizedShowtimes = async (req, res) => {
  const movieTitle = req.query.movieTitle;

  try {
    const showtimes = await getShowtimes(movieTitle);

    // Tổ chức dữ liệu thành cấu trúc JSON phân cấp
    const organizedData = showtimes.reduce((acc, suat) => {
      const { NGAYCHIEU, TINHTHANH, TENRAP, GIOBATDAU, GIOKETTHUC, TENPHIM, POSTER } = suat;

      // Chuyển đổi NGAYCHIEU thành định dạng ngày (loại bỏ giờ)
      const ngayChieu = new Date(NGAYCHIEU);
      const ngayChieuFormatted = ngayChieu.toISOString().split('T')[0]; // Lấy phần ngày (yyyy-mm-dd)

      // Tìm hoặc tạo đối tượng ngày chiếu và tỉnh thành
      let ngay = acc.find(n => n.NGAYCHIEU === ngayChieuFormatted && n.TINHTHANH === TINHTHANH);
      if (!ngay) {
        ngay = { NGAYCHIEU: ngayChieuFormatted, TINHTHANH, rapList: [] };
        acc.push(ngay);
      }

      // Tìm hoặc tạo đối tượng rạp
      let rap = ngay.rapList.find(r => r.TENRAP === TENRAP);
      if (!rap) {
        rap = { TENRAP, suatChieu: [] };
        ngay.rapList.push(rap);
      }

      // Thêm suất chiếu vào rạp
      rap.suatChieu.push({ GIOBATDAU, GIOKETTHUC });

      return acc;
    }, []); // Khởi tạo acc là một mảng rỗng

    res.json({
      TENPHIM: showtimes[0]?.TENPHIM || movieTitle,
      POSTER: showtimes[0]?.POSTER || '',
      showtimes: organizedData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaPhongChieu = async (req, res) => {
  const { movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau } = req.body;

  try {
    const result = await getMaPhongChieu(movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getNameRoom = async (req, res) => {
  const { movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau } = req.body;

  try {
    const result = await getNameRoom(movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getCodeSchedule = async (req, res) => {
  const { movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau } = req.body;

  try {
    const result = await getCodeSchedule(movieTitle, ngayChieu, tinhThanh, tenRap, gioBatDau);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getSeatBooked = async (req, res) => {
  const { giobatdau, gioketthuc, ngay, maphong } = req.body;

  try {
    const result = await getSeatBooked(giobatdau, gioketthuc, ngay, maphong);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
