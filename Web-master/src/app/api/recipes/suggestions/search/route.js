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

// GET: Lấy gợi ý tìm kiếm
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    console.log("Suggestions API called with query:", query);

    // Nếu không có từ khóa, trả về mảng rỗng
    if (!query || query.trim() === "") {
      console.log("No search term provided for suggestions");
      return NextResponse.json([], { status: 200 });
    }

    const searchTerm = `%${query.trim()}%`;
    console.log("Formatted suggestion search term:", searchTerm);

    // Tìm kiếm gợi ý chỉ trong tiêu đề món ăn
    const connection = await dbConnect();
    const [rows] = await connection.query(
      "SELECT DISTINCT recipe_title FROM recipes WHERE LOWER(recipe_title) LIKE LOWER(?) ORDER BY recipe_title LIMIT 10",
      [searchTerm]
    );
    await connection.end();

    const suggestions = rows.map((row) => row.recipe_title);
    console.log(
      `Suggestions results: ${suggestions.length} items found`,
      suggestions
    );

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
