"use client";

import React from "react";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import RecipeCard from "./RecipeCard";

const RecipeList = ({ recipes, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-2">Đang tải công thức...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Đã xảy ra lỗi: {error}</Alert>;
  }

  if (!recipes || recipes.length === 0) {
    return <Alert variant="info">Không tìm thấy công thức nào.</Alert>;
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.recipe_id}>
          <RecipeCard recipe={recipe} />
        </Col>
      ))}
    </Row>
  );
};

export default RecipeList;
