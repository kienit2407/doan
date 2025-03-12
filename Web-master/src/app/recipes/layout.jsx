"use client";

import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import Link from "next/link";

export default function RecipeLayout({ children }) {
  const [previousUrl, setPreviousUrl] = useState("/");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lấy URL trước đó từ localStorage
    if (typeof window !== "undefined") {
      const savedUrl = localStorage.getItem("previousUrl");
      if (savedUrl) {
        setPreviousUrl(savedUrl);
      }
    }
  }, []);

  const goBack = () => {
    window.location.href = previousUrl;
  };

  if (!mounted) {
    return (
      <div className="recipe-app">
        <div className="text-center p-5">Đang tải...</div>
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="recipe-app">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/recipes">Công Thức Nấu Ăn Việt Nam</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/recipes" passHref legacyBehavior>
                <Nav.Link>Trang Chủ</Nav.Link>
              </Link>
              <Link href="/recipes/search" passHref legacyBehavior>
                <Nav.Link>Tìm Kiếm</Nav.Link>
              </Link>
              <Link href="/recipes/region/North" passHref legacyBehavior>
                <Nav.Link>Miền Bắc</Nav.Link>
              </Link>
              <Link href="/recipes/region/Central" passHref legacyBehavior>
                <Nav.Link>Miền Trung</Nav.Link>
              </Link>
              <Link href="/recipes/region/South" passHref legacyBehavior>
                <Nav.Link>Miền Nam</Nav.Link>
              </Link>
            </Nav>
            <Button variant="outline-light" onClick={goBack}>
              Quay lại Trang Bán Hàng
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>{children}</main>

      <footer className="bg-dark text-white py-4 mt-5">
        <Container className="text-center">
          <p className="mb-0">
            © 2024 Công Thức Nấu Ăn Việt Nam. Tất cả các quyền được bảo lưu.
          </p>
        </Container>
      </footer>
    </div>
  );
}
