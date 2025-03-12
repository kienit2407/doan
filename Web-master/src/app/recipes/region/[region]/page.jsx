"use client";

import React, { useState, useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import Link from "next/link";
import RecipeList from "../../../Components/RecipeList";

const regionInfo = {
  North: {
    name: "Miền Bắc",
    description:
      "Ẩm thực miền Bắc Việt Nam nổi tiếng với hương vị thanh tao, nhẹ nhàng và cân bằng. Các món ăn thường ít cay, ít ngọt và sử dụng nhiều gia vị thơm như hành, tỏi, gừng.",
    image:
      "https://images.baodantoc.vn/uploads/2024/Thang-7/Ngay-18/Bang-Ngan/1t41.jpg",
  },
  Central: {
    name: "Miền Trung",
    description:
      "Ẩm thực miền Trung Việt Nam nổi tiếng với vị cay nồng đặc trưng. Các món ăn thường có màu sắc rực rỡ, hương vị đậm đà và cay thơm từ ớt, tiêu, và các loại gia vị đặc biệt.",
    image:
      "https://vietair.com.vn/Media/Images/vietair/Tin-tuc/anh-bo-tro-bai-viet/am-thuc-mien-trung-1.jpg?p=1&w=412",
  },
  South: {
    name: "Miền Nam",
    description:
      "Ẩm thực miền Nam Việt Nam nổi bật với vị ngọt và béo từ nước cốt dừa. Các món ăn thường có nhiều rau sống, gia vị tươi và được chế biến đơn giản nhưng đậm đà hương vị.",
    image:
      "https://vn1.vdrive.vn/tuulaunamdinh.com/2022/03/a-m-thu-c-mie-n-nam-o-tu-u-la-u-nha-ha-ng-chuye-n-ca-c-mo-n-a-n-ngon-ta-i-nam-di-nh-hotline-0987316102-19922.jpeg",
  },
};

export default function RegionPage({ params }) {
  const { region } = params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchRecipesByRegion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipes/region/${region}`);
        if (!response.ok) {
          throw new Error("Không thể tải danh sách công thức");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải công thức");
      } finally {
        setLoading(false);
      }
    };

    if (region && regionInfo[region]) {
      fetchRecipesByRegion();
    } else {
      setError("Vùng miền không hợp lệ");
      setLoading(false);
    }
  }, [region]);

  if (!mounted) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <p>Đang tải...</p>
        </div>
      </Container>
    );
  }

  if (!regionInfo[region]) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          Vùng miền không hợp lệ. Vui lòng chọn Miền Bắc (North), Miền Trung
          (Central) hoặc Miền Nam (South).
        </Alert>
        <div className="mt-3">
          <Link href="/recipes" className="btn btn-primary">
            Quay lại trang chính
          </Link>
        </div>
      </Container>
    );
  }

  const regionData = regionInfo[region];

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{regionData.name}</h1>
        <Link href="/recipes" className="btn btn-outline-primary">
          Quay lại
        </Link>
      </div>

      <div
        className="region-banner mb-5 position-relative rounded overflow-hidden"
        style={{ height: "300px" }}
      >
        <img
          src={regionData.image}
          alt={regionData.name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="text-center text-white p-4">
            <h1 className="display-4">{regionData.name}</h1>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className="lead">{regionData.description}</p>
      </div>

      <h2 className="mb-4">Các Món Ăn {regionData.name}</h2>
      <RecipeList recipes={recipes} loading={loading} error={error} />
    </Container>
  );
}
