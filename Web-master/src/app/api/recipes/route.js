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

// GET: Lấy tất cả công thức
export async function GET() {
  try {
    const connection = await dbConnect();
    const [rows] = await connection.query(
      "SELECT * FROM recipes ORDER BY created_at DESC"
    );
    await connection.end();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// POST: Thêm công thức mới
export async function POST(request) {
  try {
    const body = await request.json();
    const { recipe_title, ingredients, instruction, region, image_url } = body;

    const connection = await dbConnect();
    const [result] = await connection.query(
      "INSERT INTO recipes (recipe_title, ingredients, instruction, region, image_url) VALUES (?, ?, ?, ?, ?)",
      [recipe_title, ingredients, instruction, region, image_url]
    );
    await connection.end();

    return NextResponse.json(
      { message: "Công thức đã được thêm thành công", id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi thêm công thức:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
