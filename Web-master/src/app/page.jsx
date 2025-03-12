"use client";
import ProductsPage from "./user/product/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trang chủ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/recipes"
          className="p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded"
        >
          <h2 className="text-xl font-bold mb-2">Công thức nấu ăn</h2>
          <p>Khám phá các công thức nấu ăn Việt Nam</p>
        </Link>

        <Link
          href="/test-db"
          className="p-6 bg-green-50 hover:bg-green-100 border border-green-200 rounded"
        >
          <h2 className="text-xl font-bold mb-2">Kiểm tra cơ sở dữ liệu</h2>
          <p>Kiểm tra kết nối và thiết lập cơ sở dữ liệu</p>
        </Link>
      </div>
    </div>
  );
}
