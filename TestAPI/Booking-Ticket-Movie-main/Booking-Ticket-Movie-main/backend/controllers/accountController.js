const e = require('express');
const { getAccount, createAccount, checkPhone } = require('../models/accountModel'); // Import hàm getAllMovies từ movieModel

exports.getAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await getAccount(email, password);
    if (account) {
      res.json(account);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.createAccount = async (req, res) => {
    const account = req.body;
    try {
        const savedAccount = await createAccount(account);
        res.status(201).json(savedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.checkPhone = async (req, res) => {
    const { sdt } = req.body;
    try {
        const account = await checkPhone(sdt); // Hàm checkPhone này sẽ thực hiện kiểm tra trong database
        if (account) {
            return res.status(200).json({ exists: true, account }); // Trả về nếu tài khoản tồn tại
        } else {
            return res.status(200).json({ exists: false }); // Trả về nếu tài khoản không tồn tại
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
