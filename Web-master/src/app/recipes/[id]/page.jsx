"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import Link from "next/link";

const regionNames = {
  North: "Miền Bắc",
  Central: "Miền Trung",
  South: "Miền Nam",
};

const regionColors = {
  North: "primary",
  Central: "warning",
  South: "success",
};

export default function RecipeDetailPage({ params }) {
  const { id } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Không thể tải thông tin công thức");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải công thức");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!mounted) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <p>Đang tải...</p>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-2">Đang tải thông tin công thức...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Đã xảy ra lỗi: {error}</Alert>
        <div className="mt-3">
          <Link href="/user/product" className="btn btn-primary">
            Quay lại trang chủ
          </Link>
        </div>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Không tìm thấy công thức với ID: {id}</Alert>
        <div className="mt-3">
          <Link href="/user/product" className="btn btn-primary">
            Quay lại trang chủ
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{recipe.recipe_title}</h1>
        <Link href="/user/product" className="btn btn-outline-primary">
          Quay lại trang chủ
        </Link>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Img
              variant="top"
              src={
                recipe.image_url ||
                "https://via.placeholder.com/1200x600?text=Không+có+hình+ảnh"
              }
              alt={recipe.recipe_title}
              style={{ height: "400px", objectFit: "cover" }}
            />
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{recipe.recipe_title}</h2>
                <Badge bg={regionColors[recipe.region]}>
                  {regionNames[recipe.region]}
                </Badge>
              </div>

              <h4 className="mt-4">Nguyên liệu</h4>
              <ul className="mb-4">
                {recipe.ingredients.split(",").map((ingredient, index) => (
                  <li key={index}>{ingredient.trim()}</li>
                ))}
              </ul>

              <h4>Cách làm</h4>
              <div className="mb-4">
                {recipe.instruction.split(".").map((step, index) => {
                  if (step.trim()) {
                    return (
                      <p key={index}>
                        <strong>Bước {index + 1}:</strong> {step.trim()}.
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h4 className="mb-3">Thông tin công thức</h4>
              <p>
                <strong>Vùng miền:</strong> {regionNames[recipe.region]}
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(recipe.created_at).toLocaleDateString("vi-VN")}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
