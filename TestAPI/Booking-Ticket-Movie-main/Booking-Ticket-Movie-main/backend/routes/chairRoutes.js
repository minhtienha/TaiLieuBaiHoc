const express = require('express');
const { getChairsByRoom, getCountChair } = require('../controllers/chairController');

const router = express.Router();

router.post('/allchair', getChairsByRoom);
router.post('/count', getCountChair);

module.exports = router;
