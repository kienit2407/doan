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