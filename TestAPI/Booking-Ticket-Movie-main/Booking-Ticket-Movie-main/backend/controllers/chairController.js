const e = require('express');
const { getChairsByRoom, getCountChair } = require('../models/chairModel');

exports.getChairsByRoom = async (req, res) => {
  const { maphong } = req.body;
  try {
    const chairs = await getChairsByRoom(maphong);

    // Sắp xếp ghế theo thứ tự: Ghế thường, Ghế VIP, Ghế Đôi
    const seatTypeOrder = {
      "Ghế thường": 1,
      "Ghế VIP": 2,
      "Ghế Đôi": 3,
    };

    chairs.sort((a, b) => {
      return seatTypeOrder[a.TENLOAIGHE] - seatTypeOrder[b.TENLOAIGHE];
    });

    res.json(chairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCountChair = async (req, res) => {
  const { maphong } = req.body;
  try {
    const count = await getCountChair(maphong);
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};