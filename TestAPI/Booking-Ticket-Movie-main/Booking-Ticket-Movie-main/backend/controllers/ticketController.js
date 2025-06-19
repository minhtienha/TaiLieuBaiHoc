const { createTicket, getNameCustumer, getCodeTicket, CheckTicketBooked, getPartTicketInfo, getSeatTicket } = require('../models/ticketModel');

exports.createTicket = async (req, res) => {
    const {masuat, makh, giave, maghe, giobatdau, gioketthuc, ngay, madichvu} = req.body;
    try {
        const savedTicket = await createTicket(masuat, makh, giave, maghe, giobatdau, gioketthuc, ngay, JSON.parse(madichvu));
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getNameCustumer = async (req, res) => {
    const { makh } = req.body;
    try {
        const name = await getNameCustumer(makh);
        res.json(name);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCodeTicket = async (req, res) => {
    const { makh, ngaymua } = req.body;
    try {
        const codeTicket = await getCodeTicket(makh, ngaymua);
        res.json(codeTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.CheckTicketBooked = async (req, res) => {
    const { makh } = req.body;
    try {
        const result = await CheckTicketBooked(makh);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getPartTicketInfo = async (req, res) => {
    const { makh, mave } = req.body;
    try {
        const result = await getPartTicketInfo(makh, mave);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getSeatTicket = async (req, res) => {
    const { mave } = req.body;
    try {
        const result = await getSeatTicket(mave);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}