const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/login', accountController.getAccount);
router.post('/register', accountController.createAccount);
router.post('/checkPhone', accountController.checkPhone);

module.exports = router;
