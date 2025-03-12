import { connectToDatabase } from "../../../../lib/db";
import { writeFile, unlink } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";
import path from "path";

// API để lấy thông tin một banner cụ thể
export async function GET(req, { params }) {
  const { id } = params;
  const connection = await connectToDatabase();

  try {
    const [rows] = await connection.execute(
      `
      SELECT
        banner_id,
        title,
        description,
        image_url,
        color,
        is_active,
        position,
        created_at,
        updated_at
      FROM banners
      WHERE banner_id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Banner không tồn tại" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin banner:", error);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// API để cập nhật banner
export async function PUT(req, { params }) {
  const { id } = params;
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  const connection = await connectToDatabase();

  // Kiểm tra banner có tồn tại không
  const [existingBanner] = await connection.execute(
    "SELECT * FROM banners WHERE banner_id = ?",
    [id]
  );
  if (existingBanner.length === 0) {
    return new Response(JSON.stringify({ error: "Banner không tồn tại" }), {
      status: 404,
    });
  }

  let imageUrl = existingBanner[0].image_url;

  // Xử lý file upload nếu có
  const imageFile = data.image_url;
  if (imageFile instanceof File) {
    try {
      // Tạo tên file duy nhất
      const fileName = `banner-${uuidv4()}-${imageFile.name}`;
      const fileBuffer = await imageFile.arrayBuffer();

      // Lưu file mới
      await writeFile(
        `public/uploads/banners/${fileName}`,
        Buffer.from(fileBuffer)
      );
      imageUrl = `/uploads/banners/${fileName}`;

      // Xóa file cũ nếu có
      const oldImagePath = existingBanner[0].image_url;
      if (oldImagePath && oldImagePath.startsWith("/uploads/")) {
        const fullPath = path.join(process.cwd(), "public", oldImagePath);
        if (existsSync(fullPath)) {
          await unlink(fullPath);
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      return new Response(JSON.stringify({ error: "Lỗi upload ảnh" }), {
        status: 500,
      });
    }
  }

  try {
    // Cập nhật banner
    await connection.execute(
      `
      UPDATE banners
      SET
        title = ?,
        description = ?,
        image_url = ?,
        color = ?,
        is_active = ?,
        position = ?,
        updated_at = NOW()
      WHERE banner_id = ?
    `,
      [
        data.title || existingBanner[0].title,
        data.description || existingBanner[0].description,
        imageUrl,
        data.color || existingBanner[0].color,
        data.is_active !== undefined
          ? parseInt(data.is_active)
          : existingBanner[0].is_active,
        data.position !== undefined
          ? parseInt(data.position)
          : existingBanner[0].position,
        id,
      ]
    );

    return new Response(
      JSON.stringify({
        banner_id: parseInt(id),
        title: data.title || existingBanner[0].title,
        description: data.description || existingBanner[0].description,
        image_url: imageUrl,
        color: data.color || existingBanner[0].color,
        is_active:
          data.is_active !== undefined
            ? parseInt(data.is_active)
            : existingBanner[0].is_active,
        position:
          data.position !== undefined
            ? parseInt(data.position)
            : existingBanner[0].position,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật banner:", error);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
    });
  }
}

// API để xóa banner
export async function DELETE(req, { params }) {
  const { id } = params;
  const connection = await connectToDatabase();

  // Kiểm tra banner có tồn tại không
  const [existingBanner] = await connection.execute(
    "SELECT * FROM banners WHERE banner_id = ?",
    [id]
  );
  if (existingBanner.length === 0) {
    return new Response(JSON.stringify({ error: "Banner không tồn tại" }), {
      status: 404,
    });
  }

  try {
    // Xóa file ảnh nếu có
    const imagePath = existingBanner[0].image_url;
    if (imagePath && imagePath.startsWith("/uploads/")) {
      const fullPath = path.join(process.cwd(), "public", imagePath);
      if (existsSync(fullPath)) {
        await unlink(fullPath);
      }
    }

    // Xóa banner từ database
    await connection.execute("DELETE FROM banners WHERE banner_id = ?", [id]);

    return new Response(JSON.stringify({ message: "Xóa banner thành công" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
    });
  }
}
