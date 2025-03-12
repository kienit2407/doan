"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../include/nav";
import { Footers } from "../../Components/Footer";
import Search from "../../Components/Search";
import Pagination from "../../Components/Pagination";
import { Carousel } from "react-bootstrap";

export default function ProductsPage() {
  const API_URL2 = "/api/ucart";
  const [products, setProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const [searchActive, setSearchActive] = useState(false); // Trạng thái tìm kiếm
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [isHomePage, setIsHomePage] = useState(false);

  // Kiểm tra xem đang ở trang home hay trang products
  useEffect(() => {
    const path = window.location.pathname;
    setIsHomePage(path === "/" || path === "/user");
  }, []);

  // Fetch Banners
  const fetchBanners = async () => {
    try {
      console.log("Fetching banners...");
      setLoadingBanners(true);
      const response = await fetch("/api/banners");
      if (!response.ok) {
        throw new Error("Failed to fetch banners.");
      }
      const data = await response.json();
      console.log("Banners fetched:", data);

      // Chỉ lấy các banner đang active
      const activeBanners = data.filter((banner) => banner.is_active === 1);
      setBanners(activeBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      // Sử dụng dữ liệu mặc định nếu không thể fetch từ API
      setBanners([
        {
          id: 1,
          title: "Khuyến mãi mùa hè - Giảm giá đến 50%",
          description: "Áp dụng cho tất cả các sản phẩm thực phẩm tươi sống",
          image_url:
            "https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg",
          color: "bg-blue-500",
        },
        {
          id: 2,
          title: "Ưu đãi đặc biệt cho thành viên mới",
          description: "Giảm 20% cho đơn hàng đầu tiên",
          image_url:
            "https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg",
          color: "bg-green-500",
        },
        {
          id: 3,
          title: "Mua 2 tặng 1",
          description: "Áp dụng cho tất cả các loại rau củ quả",
          image_url:
            "https://vietadv.net/wp-content/uploads/2021/04/thiet-ke-banner-1.jpg",
          color: "bg-red-500",
        },
      ]);
    } finally {
      setLoadingBanners(false);
    }
  };

  // Dữ liệu mẫu cho sản phẩm
  const sampleProducts = [
    {
      product_id: 1,
      product_name: "Thịt bò Mỹ",
      description: "Thịt bò Mỹ nhập khẩu, tươi ngon",
      price: 250000,
      img_url: "https://placehold.co/600x400/e74c3c/ffffff?text=Thịt+bò+Mỹ",
      category_id: 1,
    },
    {
      product_id: 2,
      product_name: "Cá hồi Na Uy",
      description: "Cá hồi tươi nhập khẩu từ Na Uy",
      price: 300000,
      img_url: "https://placehold.co/600x400/3498db/ffffff?text=Cá+hồi+Na+Uy",
      category_id: 1,
    },
    {
      product_id: 3,
      product_name: "Rau cải xanh",
      description: "Rau cải xanh tươi ngon, không thuốc trừ sâu",
      price: 15000,
      img_url: "https://placehold.co/600x400/2ecc71/ffffff?text=Rau+cải+xanh",
      category_id: 2,
    },
    {
      product_id: 4,
      product_name: "Cà chua",
      description: "Cà chua tươi, đỏ mọng",
      price: 20000,
      img_url: "https://placehold.co/600x400/e74c3c/ffffff?text=Cà+chua",
      category_id: 2,
    },
    {
      product_id: 5,
      product_name: "Táo Mỹ",
      description: "Táo nhập khẩu từ Mỹ, giòn ngọt",
      price: 60000,
      img_url: "https://placehold.co/600x400/e74c3c/ffffff?text=Táo+Mỹ",
      category_id: 3,
    },
    {
      product_id: 6,
      product_name: "Cam Navel",
      description: "Cam Navel ngọt, mọng nước",
      price: 70000,
      img_url: "https://placehold.co/600x400/f39c12/ffffff?text=Cam+Navel",
      category_id: 3,
    },
  ];

  // Dữ liệu mẫu cho danh mục
  const sampleCategories = [
    { category_id: 1, category_name: "Thịt & Hải sản" },
    { category_id: 2, category_name: "Rau củ quả" },
    { category_id: 3, category_name: "Trái cây" },
    { category_id: 4, category_name: "Đồ uống" },
    { category_id: 5, category_name: "Gia vị" },
  ];

  // Fetch Products
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      console.log("Fetching products...");

      // Thử lấy dữ liệu từ API
      const response = await fetch("/api/inventory/product");

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", errorText);
        console.log("Using sample data instead");

        // Sử dụng dữ liệu mẫu nếu API không hoạt động
        setProducts(sampleProducts);
        return;
      }

      const data = await response.json();
      console.log("Products fetched:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.error("API did not return valid data:", data);
        console.log("Using sample data instead");

        // Sử dụng dữ liệu mẫu nếu API trả về dữ liệu không hợp lệ
        setProducts(sampleProducts);
        return;
      }

      const updatedData = data.map((product) => ({
        ...product,
        img_url: product.img_url ? `${product.img_url}` : "/image.jpg",
      }));

      setProducts(updatedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.log("Using sample data instead");

      // Sử dụng dữ liệu mẫu nếu có lỗi
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/inventory/category");

      if (!response.ok) {
        console.error("Failed to load categories");
        console.log("Using sample categories instead");

        // Sử dụng dữ liệu mẫu nếu API không hoạt động
        setCategories(sampleCategories);
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.error("API did not return valid category data");
        console.log("Using sample categories instead");

        // Sử dụng dữ liệu mẫu nếu API trả về dữ liệu không hợp lệ
        setCategories(sampleCategories);
        return;
      }

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.log("Using sample categories instead");

      // Sử dụng dữ liệu mẫu nếu có lỗi
      setCategories(sampleCategories);
    }
  };

  // Fetch Hot Products
  const fetchHotProducts = async () => {
    try {
      console.log("Fetching hot products...");

      // Thử lấy dữ liệu từ API
      const response = await fetch("/api/inventory/product");

      if (!response.ok) {
        console.error("Failed to fetch hot products");
        console.log("Using sample data for hot products");

        // Sử dụng dữ liệu mẫu nếu API không hoạt động
        setHotProducts(sampleProducts.slice(0, 4));
        return;
      }

      const data = await response.json();
      console.log("Hot products data:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.error("API did not return valid data for hot products");
        console.log("Using sample data for hot products");

        // Sử dụng dữ liệu mẫu nếu API trả về dữ liệu không hợp lệ
        setHotProducts(sampleProducts.slice(0, 4));
        return;
      }

      // Giả lập sản phẩm hot (trong thực tế, bạn có thể có API riêng hoặc trường đánh dấu sản phẩm hot)
      const hotItems = data
        .sort(() => 0.5 - Math.random()) // Sắp xếp ngẫu nhiên
        .slice(0, 4) // Lấy 4 sản phẩm
        .map((product) => ({
          ...product,
          img_url: product.img_url ? `${product.img_url}` : "/image.jpg",
        }));

      setHotProducts(hotItems);
    } catch (error) {
      console.error("Error fetching hot products:", error);
      console.log("Using sample data for hot products");

      // Sử dụng dữ liệu mẫu nếu có lỗi
      setHotProducts(sampleProducts.slice(0, 4));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductsData();
    fetchHotProducts();
    fetchBanners();
  }, []);

  // Lọc sản phẩm theo danh mục
  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.category_id === parseInt(selectedCategory)
      )
    : products;

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleAddToCart = async (product) => {
    // Lấy user_id từ localStorage (hoặc cookie nếu cần)
    const user_id = localStorage.getItem("user_id"); // Hoặc bạn có thể lấy từ cookie như Cookies.get('user_id')

    if (!user_id) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    const { product_id } = product;

    try {
      const response = await fetch("/api/ucart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          product_id,
          quantity: 1, // Mặc định thêm 1 sản phẩm vào giỏ
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Đã thêm vào giỏ hàng!");
      } else {
        alert(`Lỗi: ${data.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Lỗi khi thêm vào giỏ hàng!");
    }
  };

  const handleSearch = (isActive) => {
    setSearchActive(isActive);
  };

  return (
    <main>
      <Nav />
      <Search onSearch={handleSearch} />
      {!searchActive && (
        <div className="mx-auto p-6">
          {/* Promotion Carousel */}
          <div className="mb-8">
            {loadingBanners ? (
              <div className="text-center">Đang tải banner...</div>
            ) : (
              <Carousel>
                {banners.map((banner) => (
                  <Carousel.Item key={banner.id || banner.banner_id}>
                    <div
                      className={`relative w-full h-64 md:h-96 ${banner.color} rounded-lg overflow-hidden`}
                      style={{
                        backgroundImage: `url(${banner.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
                        <h2 className="text-3xl font-bold mb-2">
                          {banner.title}
                        </h2>
                        <p className="text-xl">{banner.description}</p>
                        <button className="mt-4 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                          Xem ngay
                        </button>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </div>

          {/* Hot Products Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left border-b-2 border-red-500 pb-2">
              Sản Phẩm Hot
            </h2>
            {loading ? (
              <div className="text-center text-blue-600">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {hotProducts.map((product) => (
                  <Link
                    key={product.product_id}
                    href={`/user/product/${product.product_id}`}
                  >
                    <div className="border rounded-lg p-4 shadow-lg cursor-pointer bg-white hover:shadow-xl transition-shadow relative">
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        HOT
                      </div>
                      <h2 className="text-xl font-semibold">
                        {product.product_name}
                      </h2>
                      <div className="relative h-40 w-full my-3">
                        <img
                          src={product.img_url || "/image.jpg"}
                          alt={product.product_name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <p className="text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-bold text-red-600">
                          ${product.price}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* All Products Section - Chỉ hiển thị khi không phải trang home */}
          {!isHomePage && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left border-b-2 border-blue-500 pb-2">
                Tất Cả Sản Phẩm
              </h1>
              {loading && (
                <div className="text-center text-blue-600">Loading...</div>
              )}
              {error && <div className="text-center text-red-600">{error}</div>}

              <div className="mb-4 flex justify-between items-center">
                <select
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mb-4 p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {currentProducts.length === 0 ? (
                <div className="text-center text-gray-600 mt-6">
                  No products available. Please add one!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  {currentProducts.map((product) => (
                    <Link
                      key={product.product_id}
                      href={`/user/product/${product.product_id}`}
                    >
                      <div className="border rounded-lg p-4 shadow-lg cursor-pointer">
                        <h2 className="text-xl font-semibold">
                          {product.product_name}
                        </h2>
                        <img
                          src={product.img_url || "/image.jpg"}
                          alt={product.product_name}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                        <p>Price: {product.price}</p>
                        <div className="flex justify-around space-x-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Thêm giỏ hàng
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && currentProducts.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
      <Footers />
    </main>
  );
}
