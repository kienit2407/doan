-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS doan;

-- Sử dụng database
USE doan;

-- Tạo bảng category nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng products nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  stock INT DEFAULT 0,
  img_url VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  category_id INT,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(category_id)
);

-- Tạo bảng recipes nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS recipes (
  recipe_id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_title VARCHAR(255) NOT NULL,
  ingredients TEXT NOT NULL,
  instruction TEXT NOT NULL,
  region ENUM('North', 'Central', 'South') NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng banners nếu chưa tồn tại
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
);

-- Thêm dữ liệu mẫu vào bảng category
INSERT IGNORE INTO category (category_id, category_name) VALUES
(1, 'Thịt & Hải sản'),
(2, 'Rau củ quả'),
(3, 'Trái cây'),
(4, 'Đồ uống'),
(5, 'Gia vị');

-- Thêm dữ liệu mẫu vào bảng products
INSERT IGNORE INTO products (product_id, product_name, description, stock, img_url, price, category_id, title) VALUES
(1, 'Thịt bò Mỹ', 'Thịt bò Mỹ nhập khẩu, tươi ngon', 100, 'https://placehold.co/600x400/e74c3c/ffffff?text=Thịt+bò+Mỹ', 250000, 1, 'Thịt bò Mỹ cao cấp'),
(2, 'Cá hồi Na Uy', 'Cá hồi tươi nhập khẩu từ Na Uy', 50, 'https://placehold.co/600x400/3498db/ffffff?text=Cá+hồi+Na+Uy', 300000, 1, 'Cá hồi tươi ngon'),
(3, 'Rau cải xanh', 'Rau cải xanh tươi ngon, không thuốc trừ sâu', 200, 'https://placehold.co/600x400/2ecc71/ffffff?text=Rau+cải+xanh', 15000, 2, 'Rau cải xanh hữu cơ'),
(4, 'Cà chua', 'Cà chua tươi, đỏ mọng', 150, 'https://placehold.co/600x400/e74c3c/ffffff?text=Cà+chua', 20000, 2, 'Cà chua Đà Lạt'),
(5, 'Táo Mỹ', 'Táo nhập khẩu từ Mỹ, giòn ngọt', 100, 'https://placehold.co/600x400/e74c3c/ffffff?text=Táo+Mỹ', 60000, 3, 'Táo Mỹ nhập khẩu'),
(6, 'Cam Navel', 'Cam Navel ngọt, mọng nước', 80, 'https://placehold.co/600x400/f39c12/ffffff?text=Cam+Navel', 70000, 3, 'Cam Navel nhập khẩu'),
(7, 'Nước ép táo', 'Nước ép táo tự nhiên, không đường', 50, 'https://placehold.co/600x400/f1c40f/ffffff?text=Nước+ép+táo', 35000, 4, 'Nước ép táo tự nhiên'),
(8, 'Trà xanh', 'Trà xanh nguyên chất', 100, 'https://placehold.co/600x400/27ae60/ffffff?text=Trà+xanh', 25000, 4, 'Trà xanh Thái Nguyên'),
(9, 'Muối biển', 'Muối biển tự nhiên', 200, 'https://placehold.co/600x400/bdc3c7/ffffff?text=Muối+biển', 10000, 5, 'Muối biển tự nhiên'),
(10, 'Tiêu đen', 'Tiêu đen Phú Quốc', 150, 'https://placehold.co/600x400/34495e/ffffff?text=Tiêu+đen', 50000, 5, 'Tiêu đen Phú Quốc');

-- Thêm dữ liệu mẫu cho công thức nấu ăn
INSERT IGNORE INTO recipes (recipe_id, recipe_title, ingredients, instruction, region, image_url) VALUES
(1, 'Phở Bò', 'Bánh phở, thịt bò, hành, gừng, quế, hoa hồi, hạt ngò, rau thơm', 'Nấu nước dùng từ xương bò. Thái thịt bò mỏng. Trần bánh phở. Bày ra tô, thêm thịt bò, chan nước dùng. Thêm rau thơm.', 'North', 'https://placehold.co/600x400/e74c3c/ffffff?text=Phở+Bò'),
(2, 'Bún Chả', 'Bún, thịt lợn, nước mắm, đường, tỏi, ớt, rau sống', 'Ướp thịt với nước mắm, đường, tỏi. Nướng thịt. Pha nước chấm. Ăn kèm bún và rau sống.', 'North', 'https://placehold.co/600x400/3498db/ffffff?text=Bún+Chả'),
(3, 'Bánh Xèo', 'Bột gạo, nước cốt dừa, nghệ, tôm, thịt, giá đỗ, hành lá', 'Trộn bột với nước cốt dừa và nghệ. Đổ bột vào chảo nóng. Thêm nhân. Gấp đôi bánh lại khi chín.', 'Central', 'https://placehold.co/600x400/2ecc71/ffffff?text=Bánh+Xèo'),
(4, 'Mì Quảng', 'Mì, thịt gà, tôm, đậu phộng, bánh tráng, rau sống', 'Nấu nước dùng từ xương. Luộc mì. Xếp mì ra tô, thêm thịt, tôm, chan ít nước. Rắc đậu phộng, ăn kèm bánh tráng và rau.', 'Central', 'https://placehold.co/600x400/f39c12/ffffff?text=Mì+Quảng'),
(5, 'Hủ Tiếu Nam Vang', 'Bánh hủ tiếu, thịt heo, tôm, gan heo, giá đỗ, hành lá', 'Nấu nước dùng từ xương heo. Luộc bánh hủ tiếu. Xếp ra tô, thêm thịt, tôm, gan, chan nước dùng. Thêm giá và hành.', 'South', 'https://placehold.co/600x400/9b59b6/ffffff?text=Hủ+Tiếu'),
(6, 'Cơm Tấm Sườn Bì Chả', 'Cơm tấm, sườn heo, bì heo, chả trứng, đồ chua, nước mắm', 'Nướng sườn. Làm bì từ da heo. Làm chả từ thịt heo và trứng. Ăn kèm cơm tấm, đồ chua và nước mắm.', 'South', 'https://placehold.co/600x400/34495e/ffffff?text=Cơm+Tấm'),
(7, 'Bún Bò Huế', 'Bún, thịt bò, giò heo, mắm ruốc, sả, ớt, rau thơm', 'Nấu nước dùng từ xương và sả. Thêm mắm ruốc và ớt. Luộc thịt bò và giò heo. Trần bún. Xếp ra tô, chan nước dùng.', 'Central', 'https://placehold.co/600x400/e67e22/ffffff?text=Bún+Bò+Huế'),
(8, 'Chả Cá Lã Vọng', 'Cá lóc, nghệ, hành, thì là, bánh đa, đậu phộng, nước mắm', 'Ướp cá với nghệ. Chiên sơ cá. Đặt chảo lên bếp, thêm cá, hành và thì là. Ăn kèm bánh đa, đậu phộng và nước mắm.', 'North', 'https://placehold.co/600x400/16a085/ffffff?text=Chả+Cá'),
(9, 'Canh Chua Cá Lóc', 'Cá lóc, đậu bắp, dứa, cà chua, giá đỗ, me, rau thơm', 'Nấu nước dùng từ me. Thêm cá, đậu bắp, dứa, cà chua và giá. Nêm nếm. Thêm rau thơm khi tắt bếp.', 'South', 'https://placehold.co/600x400/27ae60/ffffff?text=Canh+Chua'),
(10, 'Bánh Cuốn', 'Bột gạo, thịt lợn, nấm mèo, hành khô, nước mắm', 'Làm bột bánh cuốn. Hấp từng lớp bột mỏng. Thêm nhân thịt và nấm. Cuộn lại. Ăn kèm chả và nước mắm.', 'North', 'https://placehold.co/600x400/8e44ad/ffffff?text=Bánh+Cuốn');

-- Thêm dữ liệu mẫu vào bảng banners
INSERT IGNORE INTO banners (banner_id, title, description, image_url, color, is_active, position) VALUES
(1, 'Khuyến mãi mùa hè - Giảm giá đến 50%', 'Áp dụng cho tất cả các sản phẩm thực phẩm tươi sống', 'https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg', 'bg-blue-500', 1, 1),
(2, 'Ưu đãi đặc biệt cho thành viên mới', 'Giảm 20% cho đơn hàng đầu tiên', 'https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg', 'bg-green-500', 1, 2),
(3, 'Mua 2 tặng 1', 'Áp dụng cho tất cả các loại rau củ quả', 'https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg', 'bg-red-500', 1, 3);