"use client";

import React from "react";
import { Card, Badge } from "react-bootstrap";
import Link from "next/link";

const regionColors = {
  North: "primary",
  Central: "warning",
  South: "success",
};

const regionNames = {
  North: "Miền Bắc",
  Central: "Miền Trung",
  South: "Miền Nam",
};

const RecipeCard = ({ recipe }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={
          recipe.image_url ||
          "https://via.placeholder.com/300x200?text=Không+có+hình+ảnh"
        }
        alt={recipe.recipe_title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{recipe.recipe_title}</Card.Title>
          <Badge bg={regionColors[recipe.region]}>
            {regionNames[recipe.region]}
          </Badge>
        </div>
        <Card.Text>
          {recipe.ingredients.split(",").slice(0, 3).join(", ")}
          {recipe.ingredients.split(",").length > 3 ? "..." : ""}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <Link
          href={`/recipes/${recipe.recipe_id}`}
          className="btn btn-outline-primary w-100"
        >
          Xem Chi Tiết
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default RecipeCard;
