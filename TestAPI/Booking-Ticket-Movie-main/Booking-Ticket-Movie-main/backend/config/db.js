const sql = require('mssql');

const config = {
  server: "SHINICHIKUTIEN",      
  user: "sa",          
  password: "123",  
  database: "DATVEONL",
  options: {
    trustServerCertificate: true // Trust the self-signed certificate
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
    // const request = new sql.Request();
    // const result = await request.query('SELECT * FROM PHIM');
    // console.log(result.recordset);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

module.exports = { connectDB, sql };
