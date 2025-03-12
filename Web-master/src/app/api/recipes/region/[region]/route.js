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

// GET: Lấy công thức theo vùng miền
export async function GET(request, { params }) {
  try {
    const region = params.region;
    console.log("Region API called with region:", region);

    const connection = await dbConnect();
    const [rows] = await connection.query(
      "SELECT * FROM recipes WHERE region = ?",
      [region]
    );
    await connection.end();

    console.log(`Region results: ${rows.length} items found`);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy công thức theo vùng miền:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
