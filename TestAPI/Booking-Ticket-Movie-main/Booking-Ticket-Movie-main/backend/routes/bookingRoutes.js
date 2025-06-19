const express = require('express');
const { getOrganizedShowtimes, getMaPhongChieu, getNameRoom, getCodeSchedule, getSeatBooked } = require('../controllers/bookingController');

const router = express.Router();

// Định nghĩa route để lấy lịch chiếu
router.get('/schedule', getOrganizedShowtimes);
router.post('/room', getMaPhongChieu);
router.post('/nameroom', getNameRoom);
router.post('/codeschedule', getCodeSchedule);
router.post('/seatbooked', getSeatBooked);

module.exports = router;
