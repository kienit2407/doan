-- Kiểm tra bảng products
SHOW TABLES LIKE 'products';
DESCRIBE products;

-- Kiểm tra bảng category
SHOW TABLES LIKE 'category';
DESCRIBE category;

-- Kiểm tra bảng recipes
SHOW TABLES LIKE 'recipes';
DESCRIBE recipes;

-- Kiểm tra bảng banners
SHOW TABLES LIKE 'banners';
DESCRIBE banners;

-- Kiểm tra dữ liệu trong bảng products
SELECT COUNT(*) FROM products;

-- Kiểm tra dữ liệu trong bảng category
SELECT COUNT(*) FROM category;

-- Kiểm tra dữ liệu trong bảng recipes
SELECT COUNT(*) FROM recipes;

-- Kiểm tra dữ liệu trong bảng banners
SELECT COUNT(*) FROM banners;