import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Tạo kết nối đến cơ sở dữ liệu
const dbConnect = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
};

// GET: Tìm kiếm công thức theo tên
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    console.log("Search API called with query:", query);

    // Nếu không có từ khóa tìm kiếm, trả về tất cả công thức
    if (!query || query.trim() === "") {
      const connection = await dbConnect();
      const [allRecipes] = await connection.query(
        "SELECT * FROM recipes ORDER BY created_at DESC"
      );
      await connection.end();

      console.log(
        `No search term provided, returning all recipes: ${allRecipes.length} items`
      );
      return NextResponse.json(allRecipes, { status: 200 });
    }

    // Chuẩn bị từ khóa tìm kiếm với wildcard % ở cả hai đầu
    const searchTerm = `%${query.trim()}%`;
    console.log("Formatted search term:", searchTerm);

    // Chỉ tìm kiếm trong tiêu đề món ăn
    const connection = await dbConnect();
    const [rows] = await connection.query(
      "SELECT * FROM recipes WHERE LOWER(recipe_title) LIKE LOWER(?)",
      [searchTerm]
    );
    await connection.end();

    console.log(`Search results: ${rows.length} items found`);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm công thức:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
