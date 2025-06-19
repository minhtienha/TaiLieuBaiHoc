const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.post('/name', ticketController.getNameCustumer);
router.post('/codeTicket', ticketController.getCodeTicket);
router.post('/checkTicketBooked', ticketController.CheckTicketBooked);
router.post('/partTicketInfo', ticketController.getPartTicketInfo);
router.post('/seatTicket', ticketController.getSeatTicket);

module.exports = router;
