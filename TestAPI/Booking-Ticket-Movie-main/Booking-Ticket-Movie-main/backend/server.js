const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const movieRoutes = require("./routes/movieRoutes"); // Import router cho API movies
const accountRoutes = require("./routes/accountRoutes"); // Import router cho API account
const bookingRoutes = require('./routes/bookingRoutes');
const chairRoutes = require('./routes/chairRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const zalopayRoutes = require('./routes/zalopayRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối cơ sở dữ liệu
connectDB();

// Áp dụng middleware
app.use(cors());
app.use(bodyParser.json());

// Sử dụng router cho API movies
app.use("/api/movies", movieRoutes); // Sử dụng router cho API movies
app.use("/api/accounts", accountRoutes); // Sử dụng router cho API account
app.use("/api/bookings", bookingRoutes);
app.use("/api/chairs", chairRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/zalopay", zalopayRoutes);
app.use("/api/booked", ticketRoutes);

// Middleware xử lý lỗi
app.use(errorHandler);

// Khởi động server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
