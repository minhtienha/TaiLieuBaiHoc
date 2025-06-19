const { sql } = require('../config/db'); // Import kết nối SQL từ db.js

const getChairsByRoom = async (maphong) => {
    try {
        const request = new sql.Request();
        const result = await request
        .input('maphong', sql.VarChar, maphong)
        .query(`
            SELECT MAGHE, TENLOAIGHE, GIAGHE 
            FROM GHE 
            JOIN PHONGCHIEU ON GHE.MAPHONG = PHONGCHIEU.MAPHONG 
            JOIN LOAIGHE ON GHE.MALOAIGHE = LOAIGHE.MALOAIGHE 
            WHERE GHE.MAPHONG = @maphong
        `);
        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching chairs by room: ' + error.message);
    }
};

const getCountChair = async (maphong) => {
    try {
        const request = new sql.Request();
        const result = await request
        .input('maphong', sql.VarChar, maphong)
        .query(`
            SELECT COUNT(*) 
            FROM GHE 
            JOIN PHONGCHIEU ON GHE.MAPHONG = PHONGCHIEU.MAPHONG 
            JOIN LOAIGHE ON GHE.MALOAIGHE = LOAIGHE.MALOAIGHE 
            WHERE GHE.MAPHONG = @maphong
        `);
        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching chairs by room: ' + error.message);
    }
};

module.exports = {
    getChairsByRoom,
    getCountChair,
};