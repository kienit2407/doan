import { connectToDatabase } from "../../../lib/db";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// API để lấy tất cả banner
export async function GET(req) {
  const connection = await connectToDatabase();

  try {
    const [rows] = await connection.execute(`
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
      ORDER BY position ASC
    `);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu banner:", error);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// API để thêm banner mới
export async function POST(req) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());

  // Xử lý file upload
  const imageFile = data.image_url; // Đây là đối tượng File
  let imageUrl = "";

  // Nếu có file được upload
  if (imageFile instanceof File) {
    try {
      // Tạo tên file duy nhất
      const fileName = `banner-${uuidv4()}-${imageFile.name}`;
      const fileBuffer = await imageFile.arrayBuffer();

      // Lưu file vào thư mục public/uploads/banners
      await writeFile(
        `public/uploads/banners/${fileName}`,
        Buffer.from(fileBuffer)
      );
      imageUrl = `/uploads/banners/${fileName}`;
    } catch (error) {
      console.error("Lỗi khi lưu file banner:", error);
      return new Response(JSON.stringify({ error: "Lỗi upload ảnh banner" }), {
        status: 500,
      });
    }
  } else {
    // Nếu không upload file, sử dụng URL từ formData
    imageUrl = data.image_url;
  }

  // Validate các trường bắt buộc
  if (!data.title || !imageUrl) {
    return new Response(
      JSON.stringify({ error: "Thiếu tiêu đề hoặc hình ảnh banner" }),
      { status: 400 }
    );
  }

  const connection = await connectToDatabase();

  try {
    // Lấy vị trí cao nhất hiện tại để thêm banner mới vào cuối
    const [positionResult] = await connection.execute(
      "SELECT MAX(position) as maxPosition FROM banners"
    );
    const position = positionResult[0].maxPosition
      ? positionResult[0].maxPosition + 1
      : 1;

    // Mặc định banner mới sẽ active
    const isActive =
      data.is_active !== undefined ? parseInt(data.is_active) : 1;

    // Thêm banner vào database
    const [result] = await connection.execute(
      `INSERT INTO banners (title, description, image_url, color, is_active, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.title,
        data.description || "",
        imageUrl,
        data.color || "bg-blue-500",
        isActive,
        position,
      ]
    );

    return new Response(
      JSON.stringify({
        banner_id: result.insertId,
        title: data.title,
        description: data.description || "",
        image_url: imageUrl,
        color: data.color || "bg-blue-500",
        is_active: isActive,
        position: position,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi khi thêm banner:", error);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
    });
  }
}
