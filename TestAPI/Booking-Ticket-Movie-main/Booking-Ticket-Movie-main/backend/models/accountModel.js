const { sql } = require('../config/db'); // Import kết nối SQL từ db.js


const getAccount = async (email, password) => {
  try {
    const request = new sql.Request();
    const result = await request
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM KHACHHANG WHERE EMAIL = @email AND MATKHAU = @password');
    return result.recordset[0];
  } catch (error) {
    throw new Error('Error fetching account: ' + error.message);
  }
};

// Tôi muốn làm chức năng insert vào bảng KHACHHANG cho chức năng đăng ký tài khoản
const createAccount = async (account) => {
  try {
    const request = new sql.Request();
    const result = await request
      .input('ten', sql.NVarChar, account.ten)
      .input('email', sql.VarChar, account.email)
      .input('sdt', sql.VarChar, account.sdt)
      .input('password', sql.VarChar, account.password)
      .query('INSERT INTO KHACHHANG (TENKH, EMAIL, SDT, MATKHAU, NGAYDANGKY) VALUES (@ten, @email, @sdt, @password, GETDATE())');
    return result.rowsAffected[0];
  } catch (error) {
    throw new Error('Error creating account: ' + error.message);
  }
};

const checkPhone = async (sdt) => {
  try {
    const request = new sql.Request();
    const result = await request
      .input('sdt', sql.VarChar, sdt)
      .query('SELECT * FROM KHACHHANG WHERE SDT = @sdt');
    return result.recordset[0];
  } catch (error) {
    throw new Error('Error fetching account: ' + error.message);
  }
};

module.exports = {
  getAccount,
  createAccount,
  checkPhone,
};