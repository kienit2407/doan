# Backend API Công Thức Nấu Ăn Việt Nam

Backend API cho ứng dụng tìm kiếm công thức nấu ăn Việt Nam, sử dụng Express và MySQL.

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:

```
npm install
```

3. Tạo file `.env` với nội dung:

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=recipe
DB_PORT=3306
PORT=3001
```

4. Tạo cơ sở dữ liệu và bảng:
   - Sử dụng file `database.sql` để tạo cơ sở dữ liệu và bảng
   - Hoặc chạy các lệnh SQL sau:

```sql
CREATE DATABASE IF NOT EXISTS recipe CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci;

USE recipe;

CREATE TABLE IF NOT EXISTS `recipes` (
	`recipe_id` INT(11) NOT NULL AUTO_INCREMENT,
	`recipe_title` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_vietnamese_ci',
	`ingredients` TEXT NOT NULL COLLATE 'utf8mb4_vietnamese_ci',
	`instruction` TEXT NOT NULL COLLATE 'utf8mb4_vietnamese_ci',
	`region` ENUM('North','Central','South') NOT NULL COLLATE 'utf8mb4_vietnamese_ci',
	`image_url` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_vietnamese_ci',
	`created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`recipe_id`) USING BTREE
)
COLLATE='utf8mb4_vietnamese_ci'
ENGINE=InnoDB;
```

5. Khởi động server:

```
npm start
```

## API Endpoints

### Công thức

- `GET /api/recipes` - Lấy tất cả công thức
- `GET /api/recipes/:id` - Lấy chi tiết công thức theo ID
- `GET /api/recipes/search?q=query` - Tìm kiếm công thức
- `GET /api/recipes/region/:region` - Lấy công thức theo vùng miền
- `POST /api/recipes` - Thêm công thức mới
- `PUT /api/recipes/:id` - Cập nhật công thức
- `DELETE /api/recipes/:id` - Xóa công thức

### Xác thực (giả lập)

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại

## Phát triển

Để phát triển, sử dụng:

```
npm run dev
```

## Cấu trúc dự án

```
recipe-backend/
├── node_modules/
├── routes/
│   ├── recipes.js     # API endpoints cho công thức
│   └── auth.js        # API endpoints cho xác thực
├── .env               # Cấu hình môi trường
├── database.sql       # Script tạo cơ sở dữ liệu
├── db.js              # Kết nối cơ sở dữ liệu
├── package.json       # Thông tin dự án
└── server.js          # File chính của server
```
