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

// GET: Lấy công thức theo ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    console.log("Get recipe by ID API called with ID:", id);

    const connection = await dbConnect();
    const [rows] = await connection.query(
      "SELECT * FROM recipes WHERE recipe_id = ?",
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      console.log("Recipe not found with ID:", id);
      return NextResponse.json(
        { message: "Không tìm thấy công thức" },
        { status: 404 }
      );
    }

    console.log("Recipe found with ID:", id);
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy công thức theo ID:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// PUT: Cập nhật công thức theo ID
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { recipe_title, ingredients, instruction, region, image_url } = body;

    console.log("Update recipe API called with ID:", id);

    const connection = await dbConnect();
    const [result] = await connection.query(
      "UPDATE recipes SET recipe_title = ?, ingredients = ?, instruction = ?, region = ?, image_url = ? WHERE recipe_id = ?",
      [recipe_title, ingredients, instruction, region, image_url, id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      console.log("Recipe not found with ID:", id);
      return NextResponse.json(
        { message: "Không tìm thấy công thức" },
        { status: 404 }
      );
    }

    console.log("Recipe updated with ID:", id);
    return NextResponse.json(
      { message: "Công thức đã được cập nhật thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật công thức:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

// DELETE: Xóa công thức theo ID
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    console.log("Delete recipe API called with ID:", id);

    const connection = await dbConnect();
    const [result] = await connection.query(
      "DELETE FROM recipes WHERE recipe_id = ?",
      [id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      console.log("Recipe not found with ID:", id);
      return NextResponse.json(
        { message: "Không tìm thấy công thức" },
        { status: 404 }
      );
    }

    console.log("Recipe deleted with ID:", id);
    return NextResponse.json(
      { message: "Công thức đã được xóa thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa công thức:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
