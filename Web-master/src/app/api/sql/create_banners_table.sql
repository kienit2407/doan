-- Tạo bảng banners để lưu trữ thông tin banner
CREATE TABLE IF NOT EXISTS banners (
  banner_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  color VARCHAR(50) DEFAULT 'bg-blue-500',
  is_active TINYINT(1) DEFAULT 1,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Thêm một số dữ liệu mẫu
INSERT INTO banners (title, description, image_url, color, is_active, position) VALUES
('Khuyến mãi mùa hè - Giảm giá đến 50%', 'Áp dụng cho tất cả các sản phẩm thực phẩm tươi sống', 'https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg', 'bg-blue-500', 1, 1),
('Ưu đãi đặc biệt cho thành viên mới', 'Giảm 20% cho đơn hàng đầu tiên', 'https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg', 'bg-green-500', 1, 2),
('Mua 2 tặng 1', 'Áp dụng cho tất cả các loại rau củ quả', 'https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg', 'bg-red-500', 1, 3);

-- Tạo thư mục để lưu trữ ảnh banner
-- Lưu ý: Câu lệnh này không phải là SQL, bạn cần tạo thư mục này thủ công
-- mkdir -p public/uploads/banners