-- Thêm dữ liệu mẫu vào bảng category nếu chưa có
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

-- Tạo thư mục để lưu trữ ảnh sản phẩm
-- Lưu ý: Câu lệnh này không phải là SQL, bạn cần tạo thư mục này thủ công
-- mkdir -p public/uploads/products