-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Phiên bản máy chủ:            10.4.32-MariaDB - mariadb.org binary distribution
-- HĐH máy chủ:                  Win64
-- HeidiSQL Phiên bản:           12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for recipes
CREATE DATABASE IF NOT EXISTS `recipes` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `recipes`;

-- Dumping structure for bảng recipes.recipes
CREATE TABLE IF NOT EXISTS `recipes` (
  `recipe_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_title` varchar(100) NOT NULL,
  `ingredients` text NOT NULL,
  `instruction` text NOT NULL,
  `region` enum('North','Central','South') NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`recipe_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;

-- Đang đổ dữ liệu cho bảng recipes.recipes: ~8 rows (xấp xỉ)
REPLACE INTO `recipes` (`recipe_id`, `recipe_title`, `ingredients`, `instruction`, `region`, `image_url`, `created_at`) VALUES
	(8, 'Phở', 'Bánh phở, thịt bò hoặc gà, hành, gia vị (như quế, hồi, gừng), rau thơm, giá đỗ, chanh, ớt.', '1. Nấu nước dùng với các gia vị. 2. Nấu bánh phở. 3. Thêm thịt vào nước dùng. 4. Cho bánh phở và thịt vào tô, thêm rau và gia vị.', 'Central', 'https://sakos.vn/wp-content/uploads/2024/07/1658123252-cover_pho-1.jpg', '2025-03-10 06:59:22'),
	(9, 'Bánh Xèo', 'Bột bánh xèo, tôm, thịt heo, giá đỗ, rau sống, nước mắm.', '1. Làm bột bánh xèo. 2. Chiên bánh với tôm, thịt, giá đỗ. 3. Gấp bánh lại, ăn kèm với rau sống và nước mắm chua ngọt.', 'South', 'https://cdn.tgdd.vn/2020/12/CookProduct/11-1200x676.jpg', '2025-03-10 07:00:25'),
	(10, 'Cơm Tấm', 'Cơm tấm, sườn nướng, bì, chả trứng, nước mắm.', '1. Nướng sườn. 2. Làm bì và chả trứng. 3. Cho cơm tấm lên đĩa, xếp sườn, bì và chả lên trên, rưới nước mắm.', 'South', 'https://sakos.vn/wp-content/uploads/2024/10/bia-ct.jpg', '2025-03-10 07:00:59'),
	(11, 'Bún Chả', 'Bún, thịt ba chỉ, chả viên, nước mắm, tỏi, ớt, hành, đường, gia vị.', '1. Nướng thịt ba chỉ. 2. Làm nước mắm pha với tỏi, ớt, đường. 3. Cho bún vào tô, xếp thịt nướng lên trên, thêm nước mắm, rau thơm.', 'Central', 'https://cdn.unityfitness.vn/2024/07/bun-cha-bao-nhieu-calo-1.jpg', '2025-03-10 07:01:41'),
	(12, 'Hủ Tiếu', 'Hủ tiếu, thịt heo, tôm, mực, giá đỗ, hành, gia vị (hành phi, tỏi phi, tiêu, nước mắm).', '1. Nấu nước dùng từ xương heo, tôm, mực và gia vị. 2. Luộc hủ tiếu cho mềm. 3. Xếp thịt heo, tôm, mực lên tô hủ tiếu. 4. Đổ nước dùng nóng lên trên, rắc hành phi, tiêu và thêm nước mắm. Ăn kèm với rau sống.', 'South', 'https://img-global.cpcdn.com/recipes/90267c96d71f1775/1200x630cq70/photo.jpg', '2025-03-10 07:22:53'),
	(13, 'Bánh Cuốn', 'Bột gạo, thịt lợn xay, mộc nhĩ, hành phi, gia vị, nước mắm.', '1. Làm bánh cuốn: Pha bột với nước và chút dầu ăn, đổ vào chảo chống dính, hấp trong khoảng 3-5 phút. 2. Xào thịt lợn xay với mộc nhĩ, hành phi, gia vị. 3. Gói bánh cuốn với nhân thịt lợn và mộc nhĩ, ăn kèm với nước mắm pha chua ngọt.', 'North', 'https://bizweb.dktcdn.net/100/098/206/files/banh-cuon-ha-noi.jpg', '2025-03-10 07:23:33'),
	(14, 'Bún Riêu', 'Bún, riêu cua, cà chua, đậu phụ, gia vị (nước mắm, muối, tiêu), hành, rau sống.', '1. Nấu nước dùng: Ninh xương heo và cà chua. 2. Làm riêu cua: Xay cua, cho vào nước dùng và lọc lấy riêu. 3. Chiên đậu phụ. 4. Cho bún vào tô, đổ nước dùng lên, thêm riêu cua, đậu phụ chiên và rau sống.', 'North', 'https://tiki.vn/blog/wp-content/uploads/2023/07/thumb.jpeg', '2025-03-10 07:23:50'),
	(15, 'Bánh Bèo', 'Bột gạo, tôm, thịt heo, hành phi, gia vị (nước mắm, tiêu, đường).', '1. Pha bột bánh bèo, đổ vào chén nhỏ hấp cách thủy. 2. Thịt heo xay nhỏ, tôm hấp hoặc xào qua, thái nhỏ. 3. Khi bánh bèo chín, cho tôm, thịt, hành phi lên trên. 4. Rưới nước mắm pha chua ngọt lên và thưởng thức.', 'Central', 'https://vietfood.org.vn/wp-content/uploads/2021/05/BanhBeo2.jpg', '2025-03-10 07:24:36');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
