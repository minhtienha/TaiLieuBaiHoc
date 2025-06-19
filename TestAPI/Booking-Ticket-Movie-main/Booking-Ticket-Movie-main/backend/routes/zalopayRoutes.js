const express = require('express');
const router = express.Router();
const zalopayController = require('../controllers/zalopayController');

router.post('/', zalopayController.createOrderZalopay);
router.post('/order-status/:app_trans_id', zalopayController.order_status);
router.post('/callback', zalopayController.callback);

module.exports = router;
