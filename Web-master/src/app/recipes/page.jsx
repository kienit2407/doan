"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Card,
  Button,
  Form,
  Dropdown,
  ListGroup,
  Alert,
} from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RecipeList from "../Components/RecipeList";

// Tùy chỉnh CSS cho dropdown
const dropdownStyle = {
  position: "relative",
  zIndex: 1000, // Đảm bảo dropdown hiển thị trên các phần tử khác
};

const dropdownMenuStyle = {
  zIndex: 1001, // Đảm bảo menu dropdown hiển thị trên các phần tử khác
};

// Tùy chỉnh CSS cho gợi ý tìm kiếm
const suggestionsStyle = {
  position: "absolute",
  width: "100%",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 1002,
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  borderRadius: "0 0 4px 4px",
  border: "1px solid #ced4da",
  borderTop: "none",
};

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tạo ref cho phần hiển thị kết quả để cuộn đến
  const resultSectionRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        console.log("Fetching recipes...");
        const response = await fetch("/api/recipes");
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API response error:", errorText);
          throw new Error(
            `Không thể tải danh sách công thức. Status: ${response.status}, Error: ${errorText}`
          );
        }
        const data = await response.json();
        console.log("Fetched recipes:", data);

        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          throw new Error("Định dạng dữ liệu không hợp lệ từ API");
        }

        console.log("Fetched recipes count:", data.length);
        setRecipes(data);
        setFilteredRecipes(data);

        // Lấy 3 công thức nổi bật (có thể thay đổi logic này)
        if (data.length > 0) {
          setFeaturedRecipes(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải công thức");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Lọc công thức khi thay đổi vùng miền
  useEffect(() => {
    if (selectedRegion) {
      setFilteredRecipes(
        recipes.filter((recipe) => recipe.region === selectedRegion)
      );
    } else {
      setFilteredRecipes(recipes);
    }
  }, [selectedRegion, recipes]);

  // Lấy gợi ý tìm kiếm khi người dùng nhập
  useEffect(() => {
    let timeoutId = null;

    const fetchSuggestions = async () => {
      if (searchTerm.trim().length > 1) {
        try {
          setFetchingSuggestions(true);
          setSearchError(null);
          console.log("Fetching suggestions for:", searchTerm);
          const response = await fetch(
            `/api/recipes/suggestions/search?q=${encodeURIComponent(
              searchTerm.trim()
            )}`
          );
          if (!response.ok) {
            throw new Error("Không thể lấy gợi ý tìm kiếm");
          }
          const data = await response.json();
          console.log("Suggestions response:", data);
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          setSearchError("Không thể lấy gợi ý tìm kiếm. Vui lòng thử lại sau.");
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setFetchingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Sử dụng debounce để tránh gọi API quá nhiều
    if (searchTerm.trim().length > 1) {
      timeoutId = setTimeout(() => {
        fetchSuggestions();
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchTerm]);

  // Xử lý click bên ngoài để ẩn gợi ý
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError(null);
    if (searchTerm.trim()) {
      console.log("Navigating to search with term:", searchTerm);
      router.push(`/recipes/search?q=${encodeURIComponent(searchTerm)}`);
    } else {
      setSearchError("Vui lòng nhập từ khóa tìm kiếm");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("Suggestion clicked:", suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchError(null);
    router.push(`/recipes/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleRegionSelect = (region) => {
    console.log("Region selected:", region);
    setSelectedRegion(region);

    // Cuộn đến phần hiển thị kết quả sau khi chọn vùng miền
    setTimeout(() => {
      if (resultSectionRef.current) {
        resultSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const regionNames = {
    North: "Miền Bắc",
    Central: "Miền Trung",
    South: "Miền Nam",
    "": "Tất cả vùng miền",
  };

  // eslint-disable-next-line no-unused-vars
  const regionImageUrls = {
    North:
      "https://images.baodantoc.vn/uploads/2024/Thang-7/Ngay-18/Bang-Ngan/1t41.jpg",
    Central:
      "https://vietair.com.vn/Media/Images/vietair/Tin-tuc/anh-bo-tro-bai-viet/am-thuc-mien-trung-1.jpg?p=1&w=412",
    South:
      "https://vn1.vdrive.vn/tuulaunamdinh.com/2022/03/a-m-thu-c-mie-n-nam-o-tu-u-la-u-nha-ha-ng-chuye-n-ca-c-mo-n-a-n-ngon-ta-i-nam-di-nh-hotline-0987316102-19922.jpeg",
    "": "https://via.placeholder.com/50x30?text=Tất+cả",
  };

  if (!mounted) {
    return (
      <Container>
        <div className="text-center my-5">
          <p>Đang tải...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>Công Thức Nấu Ăn Việt Nam</h1>
        <Link href="/user/product" className="btn btn-outline-primary">
          Quay lại Trang Chủ
        </Link>
      </div>

      {/* Banner Carousel - Công thức nổi bật */}
      {featuredRecipes.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-3">Công Thức Nổi Bật</h2>
          <Carousel>
            {featuredRecipes.map((recipe) => (
              <Carousel.Item key={recipe.recipe_id}>
                <img
                  className="d-block w-100"
                  src={
                    recipe.image_url ||
                    "https://via.placeholder.com/1200x400?text=Công+Thức+Nấu+Ăn+Việt+Nam"
                  }
                  alt={recipe.recipe_title}
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                  <h3>{recipe.recipe_title}</h3>
                  <p>
                    Món ăn đặc trưng của{" "}
                    {recipe.region === "North"
                      ? "miền Bắc"
                      : recipe.region === "Central"
                      ? "miền Trung"
                      : "miền Nam"}
                  </p>
                  <Link
                    href={`/recipes/${recipe.recipe_id}`}
                    className="btn btn-light"
                  >
                    Xem Chi Tiết
                  </Link>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* Thanh tìm kiếm và dropdown lọc vùng miền */}
      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">Tìm Kiếm & Lọc Công Thức</h4>
          <Row className="align-items-end">
            <Col md={8}>
              <Form onSubmit={handleSearch}>
                <Form.Group>
                  <Form.Label>Tìm Kiếm Công Thức</Form.Label>
                  <div
                    className="d-flex position-relative"
                    ref={searchInputRef}
                  >
                    <Form.Control
                      type="search"
                      placeholder="Nhập tên món ăn, nguyên liệu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="me-2"
                      onFocus={() =>
                        searchTerm.trim().length > 1 && setShowSuggestions(true)
                      }
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={fetchingSuggestions}
                    >
                      {fetchingSuggestions ? "Đang tìm..." : "Tìm Kiếm"}
                    </Button>

                    {/* Gợi ý tìm kiếm */}
                    {showSuggestions && suggestions.length > 0 && (
                      <ListGroup style={suggestionsStyle}>
                        {suggestions.map((suggestion, index) => (
                          <ListGroup.Item
                            key={index}
                            action
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="py-2"
                          >
                            {suggestion}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </div>
                  {searchError && (
                    <div className="text-danger mt-2">{searchError}</div>
                  )}
                </Form.Group>
              </Form>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Lọc Theo Vùng Miền</Form.Label>
                <div style={dropdownStyle}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="dropdown-region"
                      className="w-100"
                    >
                      {regionNames[selectedRegion]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropdownMenuStyle} className="w-100">
                      <Dropdown.Item onClick={() => handleRegionSelect("")}>
                        Tất cả vùng miền
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleRegionSelect("North")}
                      >
                        Miền Bắc
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleRegionSelect("Central")}
                      >
                        Miền Trung
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleRegionSelect("South")}
                      >
                        Miền Nam
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Hiển thị kết quả lọc */}
      <div ref={resultSectionRef}>
        <h3 className="mb-3">
          {selectedRegion
            ? `Công Thức ${regionNames[selectedRegion]}`
            : "Tất Cả Công Thức"}
        </h3>
        <RecipeList recipes={filteredRecipes} loading={loading} error={error} />
      </div>

      {/* Liên kết đến trang chủ Web-master */}
      <div className="text-center mt-5 mb-3">
        <Link href="/user/product" className="btn btn-outline-primary">
          Quay lại Trang Chủ
        </Link>
      </div>
    </Container>
  );
}
