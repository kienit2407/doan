"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";
import RecipeList from "../../Components/RecipeList";

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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef(null);

  // Đảm bảo component đã được mount trên client
  useEffect(() => {
    setMounted(true);
    if (searchParams) {
      setSearchTerm(searchParams.get("q") || "");
      setSelectedRegion(searchParams.get("region") || "");
    }
  }, [searchParams]);

  // Chỉ thực hiện tìm kiếm khi component đã mount
  useEffect(() => {
    if (mounted) {
      const query = searchParams.get("q");
      const region = searchParams.get("region");

      console.log("Search params changed:", { query, region });
      if (query || region) {
        searchRecipes(query, region);
      }
    }
  }, [searchParams, mounted]);

  // Lấy gợi ý tìm kiếm khi người dùng nhập
  useEffect(() => {
    let timeoutId = null;

    const fetchSuggestions = async () => {
      if (searchTerm.trim().length > 1) {
        try {
          setFetchingSuggestions(true);
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

  const searchRecipes = async (query, region) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Searching recipes with:", { query, region });
      let response;

      if (region && !query) {
        // Tìm theo vùng miền
        response = await fetch(`/api/recipes/region/${region}`);
      } else if (query) {
        // Tìm theo từ khóa
        response = await fetch(
          `/api/recipes/search?q=${encodeURIComponent(query.trim())}`
        );

        if (!response.ok) {
          throw new Error("Không thể tìm kiếm công thức");
        }

        const data = await response.json();

        // Lọc theo vùng miền nếu có
        if (region) {
          setRecipes(data.filter((recipe) => recipe.region === region));
        } else {
          setRecipes(data);
        }

        setLoading(false);
        return;
      } else {
        // Nếu không có từ khóa và vùng miền, lấy tất cả công thức
        response = await fetch("/api/recipes");
      }

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm công thức");
      }

      const data = await response.json();
      console.log("Search results:", data.length || 0);
      setRecipes(data);
    } catch (err) {
      console.error("Error searching recipes:", err);
      setError(err.message || "Đã xảy ra lỗi khi tìm kiếm công thức");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);
    setShowSuggestions(false);

    // Cập nhật URL params
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedRegion) params.set("region", selectedRegion);

    console.log(
      "Updating search params:",
      Object.fromEntries(params.entries())
    );
    router.push(`/recipes/search?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("Suggestion clicked:", suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setError(null);

    // Cập nhật URL params
    const params = new URLSearchParams();
    params.set("q", suggestion);
    if (selectedRegion) params.set("region", selectedRegion);

    console.log(
      "Updating search params from suggestion:",
      Object.fromEntries(params.entries())
    );
    router.push(`/recipes/search?${params.toString()}`);
  };

  // Nếu component chưa được mount, trả về skeleton hoặc loading state
  if (!mounted) {
    return (
      <Container className="py-5">
        <h2 className="mb-4">Tìm Kiếm Công Thức</h2>
        <div className="text-center">Đang tải...</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tìm Kiếm Công Thức</h2>
        <Link href="/recipes" className="btn btn-outline-primary">
          Quay lại
        </Link>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={6}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label>Từ khóa</Form.Label>
                  <div className="position-relative" ref={searchInputRef}>
                    <Form.Control
                      type="text"
                      placeholder="Nhập tên món ăn..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() =>
                        searchTerm.trim().length > 1 && setShowSuggestions(true)
                      }
                    />

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
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3 mb-md-0">
                  <Form.Label>Vùng miền</Form.Label>
                  <Form.Select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Tất cả vùng miền</option>
                    <option value="North">Miền Bắc</option>
                    <option value="Central">Miền Trung</option>
                    <option value="South">Miền Nam</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={fetchingSuggestions}
                  >
                    {fetchingSuggestions ? "Đang tìm..." : "Tìm Kiếm"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-4">
        <h3>Kết Quả Tìm Kiếm</h3>
        {searchParams.get("q") && (
          <p>
            Từ khóa: <strong>"{searchParams.get("q")}"</strong>
          </p>
        )}
        {searchParams.get("region") && (
          <p>
            Vùng miền:{" "}
            <strong>
              {searchParams.get("region") === "North"
                ? "Miền Bắc"
                : searchParams.get("region") === "Central"
                ? "Miền Trung"
                : "Miền Nam"}
            </strong>
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tìm kiếm...</span>
          </Spinner>
          <p className="mt-3">Đang tìm kiếm công thức...</p>
        </div>
      ) : (
        <RecipeList recipes={recipes} loading={false} error={null} />
      )}
    </Container>
  );
}
