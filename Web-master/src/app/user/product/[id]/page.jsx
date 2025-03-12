"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  FaUserAlt,
  FaShippingFast,
  FaLeaf,
  FaUtensils,
  FaGift,
} from "react-icons/fa";
import Nav from "../../include/nav";
import { Footers } from "../../../Components/Footer";
import ProductDetailsList from "../../../Components/ProductList";
import { Carousel } from "react-bootstrap";

export default function ProductDetail() {
  const params = useParams(); // Sử dụng useParams để lấy dynamic params
  const id = params?.id; // Lấy `id` từ params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  const router = useRouter();
  const API_URL2 = "/api/ucart";

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

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/inventory/product/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        console.log("Product data:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchBanners();
  }, [id]);

  const handleAddToCart = async (product) => {
    // Lấy user_id từ localStorage (hoặc cookie nếu cần)
    const user_id = localStorage.getItem("user_id"); // Hoặc bạn có thể lấy từ cookie như Cookies.get('user_id')

    if (!user_id) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    const { product_id } = product;

    try {
      const response = await fetch(API_URL2, {
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Sản phẩm không tồn tại</div>;

  return (
    <main>
      <Nav />

      {/* Promotion Carousel */}
      <div className="mb-8 px-6 pt-6">
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
                    <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
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

      <div className="flex flex-col md:flex-row gap-6 p-6 bg-white">
        {/* Phần bên trái */}
        <div className="md:w-2/3">
          <div className="flex">
            <img
              src={product.img_url || "/image.jpg"}
              alt={product.product_name}
              className="rounded-lg w-full max-w-lg h-auto"
            />
            <div className="m-5">
              <h1 className="text-3xl font-bold text-black mb-4">
                {product.product_name}
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                {product.description}
              </p>
              <p className="text-2xl font-bold text-red-600 mb-6">
                ${product.price}
              </p>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Thêm vào giỏ hàng
                </button>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                  Mua ngay
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-2">
                  Thông tin sản phẩm:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FaLeaf className="text-green-500 mr-2" />
                    <span>Sản phẩm tươi sạch</span>
                  </li>
                  <li className="flex items-center">
                    <FaShippingFast className="text-blue-500 mr-2" />
                    <span>Giao hàng nhanh trong ngày</span>
                  </li>
                  <li className="flex items-center">
                    <FaUtensils className="text-orange-500 mr-2" />
                    <span>Chế biến đa dạng</span>
                  </li>
                  <li className="flex items-center">
                    <FaGift className="text-red-500 mr-2" />
                    <span>Ưu đãi khi mua số lượng lớn</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Phần bên phải */}
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Dịch vụ của chúng tôi
            </h2>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaShippingFast className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Giao hàng miễn phí</h3>
                  <p className="text-sm text-gray-600">
                    Cho đơn hàng từ 200.000đ
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FaLeaf className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Sản phẩm hữu cơ</h3>
                  <p className="text-sm text-gray-600">
                    Đảm bảo an toàn sức khỏe
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <FaUserAlt className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">Hỗ trợ 24/7</h3>
                  <p className="text-sm text-gray-600">Luôn sẵn sàng phục vụ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footers />
    </main>
  );
}
