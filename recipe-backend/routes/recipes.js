const express = require("express");
const router = express.Router();
const { pool } = require("../db");

// Middleware để log các request đến route recipes
router.use((req, res, next) => {
  console.log(
    `Recipe Route: ${req.method} ${req.originalUrl} - Params: ${JSON.stringify(
      req.params
    )} - Query: ${JSON.stringify(req.query)}`
  );
  next();
});

// Lấy tất cả công thức
router.get("/", async (req, res) => {
  try {
    console.log("Get all recipes API called");
    const [rows] = await pool.query(
      "SELECT * FROM recipes ORDER BY created_at DESC"
    );
    console.log(`All recipes: ${rows.length} items found`);
    res.json(rows);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Gợi ý tìm kiếm - Đặt trước các route có tham số
router.get("/suggestions/search", async (req, res) => {
  try {
    console.log("Suggestions API called with query:", req.query.q);

    // Nếu không có từ khóa, trả về mảng rỗng
    if (!req.query.q || req.query.q.trim() === "") {
      console.log("No search term provided for suggestions");
      return res.json([]);
    }

    const searchTerm = `%${req.query.q.trim()}%`;
    console.log("Formatted suggestion search term:", searchTerm);

    // Tìm kiếm gợi ý chỉ trong tiêu đề món ăn
    const [rows] = await pool.query(
      "SELECT DISTINCT recipe_title FROM recipes WHERE LOWER(recipe_title) LIKE LOWER(?) ORDER BY recipe_title LIMIT 10",
      [searchTerm]
    );

    const suggestions = rows.map((row) => row.recipe_title);
    console.log(
      `Suggestions results: ${suggestions.length} items found`,
      suggestions
    );
    res.json(suggestions);
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Tìm kiếm công thức - Đặt trước các route có tham số
router.get("/search", async (req, res) => {
  try {
    console.log("Search API called with query:", req.query.q);

    // Nếu không có từ khóa tìm kiếm, trả về tất cả công thức
    if (!req.query.q || req.query.q.trim() === "") {
      const [allRecipes] = await pool.query(
        "SELECT * FROM recipes ORDER BY created_at DESC"
      );
      console.log(
        `No search term provided, returning all recipes: ${allRecipes.length} items`
      );
      return res.json(allRecipes);
    }

    // Chuẩn bị từ khóa tìm kiếm với wildcard % ở cả hai đầu
    const searchTerm = `%${req.query.q.trim()}%`;
    console.log("Formatted search term:", searchTerm);

    // Chỉ tìm kiếm trong tiêu đề món ăn
    const [rows] = await pool.query(
      "SELECT * FROM recipes WHERE LOWER(recipe_title) LIKE LOWER(?)",
      [searchTerm]
    );

    console.log(`Search results: ${rows.length} items found`);
    res.json(rows);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm công thức:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy công thức theo vùng miền - Đặt trước các route có tham số
router.get("/region/:region", async (req, res) => {
  try {
    console.log("Region API called with region:", req.params.region);
    const [rows] = await pool.query("SELECT * FROM recipes WHERE region = ?", [
      req.params.region,
    ]);
    console.log(`Region results: ${rows.length} items found`);
    res.json(rows);
  } catch (error) {
    console.error("Lỗi khi lấy công thức theo vùng miền:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy công thức theo ID - Đặt sau các route đặc biệt
router.get("/:id", async (req, res) => {
  try {
    console.log("Get recipe by ID API called with ID:", req.params.id);
    const [rows] = await pool.query(
      "SELECT * FROM recipes WHERE recipe_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      console.log("Recipe not found with ID:", req.params.id);
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    console.log("Recipe found with ID:", req.params.id);
    res.json(rows[0]);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết công thức:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Thêm công thức mới
router.post("/", async (req, res) => {
  try {
    const { recipe_title, ingredients, instruction, region, image_url } =
      req.body;

    if (!recipe_title || !ingredients || !instruction || !region) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const [result] = await pool.query(
      "INSERT INTO recipes (recipe_title, ingredients, instruction, region, image_url) VALUES (?, ?, ?, ?, ?)",
      [recipe_title, ingredients, instruction, region, image_url]
    );

    res.status(201).json({
      message: "Thêm công thức thành công",
      recipe_id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi thêm công thức:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Cập nhật công thức
router.put("/:id", async (req, res) => {
  try {
    const { recipe_title, ingredients, instruction, region, image_url } =
      req.body;

    if (!recipe_title || !ingredients || !instruction || !region) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const [result] = await pool.query(
      "UPDATE recipes SET recipe_title = ?, ingredients = ?, instruction = ?, region = ?, image_url = ? WHERE recipe_id = ?",
      [recipe_title, ingredients, instruction, region, image_url, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    res.json({ message: "Cập nhật công thức thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật công thức:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Xóa công thức
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM recipes WHERE recipe_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy công thức" });
    }

    res.json({ message: "Xóa công thức thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa công thức:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
