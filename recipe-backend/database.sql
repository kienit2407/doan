-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS recipe CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci;

USE recipe;

-- Tạo bảng recipes
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

-- Thêm dữ liệu mẫu
INSERT INTO `recipes` (`recipe_title`, `ingredients`, `instruction`, `region`, `image_url`) VALUES
('Phở Bò', 'Bánh phở, thịt bò, hành, gừng, quế, hoa hồi, hạt ngò, rau thơm', 'Nấu nước dùng từ xương bò trong 8 giờ. Thái thịt bò mỏng. Trần bánh phở. Bày ra tô và thêm nước dùng, thịt bò, hành, rau thơm.', 'North', 'https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250230038502.jpg'),
('Bún Bò Huế', 'Bún, thịt bò, giò heo, mắm ruốc, sả, ớt, rau thơm', 'Nấu nước dùng từ xương bò và giò heo. Phi thơm sả và ớt. Thêm mắm ruốc. Trần bún. Bày ra tô và thêm nước dùng, thịt bò, giò heo, rau thơm.', 'Central', 'https://cdn.tgdd.vn/Files/2018/04/01/1078873/nau-bun-bo-hue-cuc-de-tai-nha-202109161718033502.jpg'),
('Hủ Tiếu Nam Vang', 'Bánh hủ tiếu, thịt heo, tôm, gan heo, trứng cút, hẹ, giá đỗ', 'Nấu nước dùng từ xương heo. Luộc thịt heo, tôm, gan heo. Trần bánh hủ tiếu. Bày ra tô và thêm nước dùng, thịt heo, tôm, gan heo, trứng cút, hẹ, giá đỗ.', 'South', 'https://cdn.tgdd.vn/Files/2020/05/20/1257426/cach-nau-hu-tieu-nam-vang-thom-ngon-chuan-vi-nguoi-hoa-202005201544281782.jpg');