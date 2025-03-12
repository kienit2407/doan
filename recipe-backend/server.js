const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { testConnection } = require("./db");
const recipesRoutes = require("./routes/recipes");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware để log các request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Kiểm tra kết nối cơ sở dữ liệu
testConnection();

// Routes
app.use("/api/recipes", recipesRoutes);
app.use("/api/auth", authRoutes);

// Route mặc định
app.get("/", (req, res) => {
  res.json({ message: "API Công Thức Nấu Ăn Việt Nam" });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("Lỗi server:", err);
  res.status(500).json({ message: "Lỗi server", error: err.message });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
