const { sql } = require('../config/db'); // Import kết nối SQL từ db.js

const getService = async () => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM DICHVU');
    return result.recordset;
  } catch (error) {
    throw new Error('Error fetching services: ' + error.message);
  }
}

module.exports = {
  getService,
};