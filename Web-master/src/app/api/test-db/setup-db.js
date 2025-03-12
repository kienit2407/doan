import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export async function setupDatabase() {
  try {
    // Lấy thông tin kết nối từ biến môi trường
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

    console.log("Setting up database with config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      port: dbConfig.port,
    });

    // Kết nối đến MySQL server (không chỉ định database)
    const rootConnection = await mysql.createConnection(dbConfig);
    console.log("MySQL server connection successful");

    // Tạo database nếu chưa tồn tại
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS doan`);
    console.log("Database 'doan' created or already exists");

    // Chuyển sang sử dụng database doan
    await rootConnection.query(`USE doan`);
    console.log("Using database 'doan'");

    // Đọc và thực thi file SQL
    const sqlFilePath = path.join(
      process.cwd(),
      "src",
      "app",
      "api",
      "sql",
      "setup_database.sql"
    );
    console.log("Reading SQL file from:", sqlFilePath);

    if (fs.existsSync(sqlFilePath)) {
      const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

      // Tách các câu lệnh SQL
      const sqlStatements = sqlContent
        .split(";")
        .filter((statement) => statement.trim() !== "")
        .map((statement) => statement.trim() + ";");

      console.log(`Found ${sqlStatements.length} SQL statements to execute`);

      // Thực thi từng câu lệnh SQL
      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i];
        try {
          // Bỏ qua câu lệnh CREATE DATABASE và USE vì đã thực hiện ở trên
          if (
            !statement.includes("CREATE DATABASE") &&
            !statement.includes("USE doan")
          ) {
            await rootConnection.query(statement);
          }
        } catch (error) {
          console.error(
            `Error executing SQL statement #${i + 1}:`,
            error.message
          );
          console.error("Statement:", statement);
        }
      }

      console.log("SQL file executed successfully");
    } else {
      console.error("SQL file not found at:", sqlFilePath);
    }

    // Đóng kết nối
    await rootConnection.end();
    console.log("Database setup completed");

    return {
      success: true,
      message: "Database setup completed successfully",
    };
  } catch (error) {
    console.error("Database setup error:", error);
    return {
      success: false,
      message: "Error setting up database",
      error: error.message,
    };
  }
}
