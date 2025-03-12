import mysql from "mysql2/promise";

export async function GET() {
  try {
    // Lấy thông tin kết nối từ biến môi trường
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    };

    console.log("Database config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
    });

    // Thử kết nối đến MySQL server trước (không chỉ định database)
    try {
      const rootConnection = await mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        port: dbConfig.port,
      });

      console.log("MySQL server connection successful");

      // Kiểm tra xem database có tồn tại không
      const [dbResults] = await rootConnection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbConfig.database}'`
      );

      const dbExists = dbResults.length > 0;

      if (!dbExists) {
        console.log(
          `Database '${dbConfig.database}' does not exist, creating it...`
        );
        await rootConnection.query(
          `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
        );
        console.log(`Database '${dbConfig.database}' created successfully`);
      } else {
        console.log(`Database '${dbConfig.database}' already exists`);
      }

      await rootConnection.end();
    } catch (rootError) {
      console.error("Error connecting to MySQL server:", rootError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Lỗi kết nối đến MySQL server",
          error: rootError.message,
          step: "root_connection",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Thử kết nối đến database
    const connection = await mysql.createConnection(dbConfig);
    console.log("Database connection successful");

    // Kiểm tra các bảng
    const tables = {};

    // Kiểm tra bảng products
    try {
      const [productsResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM products"
      );
      tables.products = {
        exists: true,
        count: productsResult[0].count,
      };
    } catch (error) {
      console.error("Error checking products table:", error.message);
      tables.products = {
        exists: false,
        error: error.message,
      };
    }

    // Kiểm tra bảng recipes
    try {
      const [recipesResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM recipes"
      );
      tables.recipes = {
        exists: true,
        count: recipesResult[0].count,
      };
    } catch (error) {
      console.error("Error checking recipes table:", error.message);
      tables.recipes = {
        exists: false,
        error: error.message,
      };
    }

    // Kiểm tra bảng category
    try {
      const [categoryResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM category"
      );
      tables.category = {
        exists: true,
        count: categoryResult[0].count,
      };
    } catch (error) {
      console.error("Error checking category table:", error.message);
      tables.category = {
        exists: false,
        error: error.message,
      };
    }

    // Kiểm tra bảng banners
    try {
      const [bannersResult] = await connection.execute(
        "SELECT COUNT(*) as count FROM banners"
      );
      tables.banners = {
        exists: true,
        count: bannersResult[0].count,
      };
    } catch (error) {
      console.error("Error checking banners table:", error.message);
      tables.banners = {
        exists: false,
        error: error.message,
      };
    }

    // Đóng kết nối
    await connection.end();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Kết nối database thành công",
        config: {
          host: dbConfig.host,
          user: dbConfig.user,
          database: dbConfig.database,
          port: dbConfig.port,
        },
        tables,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database connection error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Lỗi kết nối database",
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
