const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trong thực tế, bạn sẽ kiểm tra thông tin đăng nhập từ cơ sở dữ liệu
    // Ở đây chúng ta giả lập một người dùng admin
    if (username === "admin" && password === "admin123") {
      res.json({
        user_id: 1,
        username: "admin",
        role: "admin",
      });
    } else {
      res.status(401).json({ message: "Thông tin đăng nhập không chính xác" });
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Trong thực tế, bạn sẽ kiểm tra và thêm người dùng vào cơ sở dữ liệu
    // Ở đây chúng ta giả lập thành công
    res.status(201).json({
      message: "Đăng ký thành công",
      user_id: Math.floor(Math.random() * 1000) + 2,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy thông tin người dùng hiện tại
router.get("/me", (req, res) => {
  // Trong thực tế, bạn sẽ lấy thông tin từ token xác thực
  // Ở đây chúng ta giả lập một người dùng admin
  res.json({
    user_id: 1,
    username: "admin",
    role: "admin",
  });
});

module.exports = router;
